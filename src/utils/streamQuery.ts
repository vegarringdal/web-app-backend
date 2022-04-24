import OracleDB from "oracledb";
import { DB_FETCH_SIZE, CONSOLE_INFO } from "../config";
import { log } from "@rad-common";
import { getDatabaseConnection } from "./getDatabaseConnection";

/**
 * stream helper to get data out of oracle
 * when not using clean array or json first data is timestamp, next is metadata
 * @param sqlString select * from something etc
 * @param sqlBindings use [] if nothing
 * @param userID is sendt to oracle db as clientID for seesion data
 * @param tableNameOrReportName sent as action to oracle db session data
 * @param usejson retuns pure json TODO > change to type -> JSON, ARRAY, META
 * @param sendData callback to forward data to
 * @param cleanArray retuns only json
 * @returns promise
 */
export async function streamQuery(
    sqlString: string,
    sqlBindings: any[],
    userID: string,
    tableNameOrReportName: string,
    usejson: boolean | null,
    sendData: (data: string | any[], done: boolean) => void,
    cleanArray = false
): Promise<{ success: boolean; msg?: any }> {
    return new Promise(async (resolve, reject) => {
        let connection: OracleDB.Connection;
        let stream: any;
        let buffer: any[] = usejson || cleanArray ? [] : [new Date()]; // use date for smart refresh
        let closed = false;
        let error = false;
        const skipMeta = usejson || cleanArray;
        try {
            log(CONSOLE_INFO, `Streaming, getConnection`);
            connection = await getDatabaseConnection(userID);
            log(CONSOLE_INFO, `Streaming, getConnection OK`);
        } catch (err) {
            log(CONSOLE_INFO, `Streaming, getConnection FAILED:`, err);
            reject({ success: false, msg: err });
            return;
        }

        try {
            log(CONSOLE_INFO, `Streaming, calling queryStream`);
            stream = connection.queryStream(sqlString, sqlBindings, {
                outFormat: usejson && !cleanArray ? OracleDB.OUT_FORMAT_OBJECT : OracleDB.OUT_FORMAT_ARRAY
            });
            log(CONSOLE_INFO, `Streaming, queryStream ok`);
        } catch (err) {
            reject({ success: false, msg: err });
        }

        function closeConnection() {
            if (!closed) {
                closed = true;
                process.nextTick(async () => {
                    await connection.close();
                });
            }
        }

        stream?.on("close", function () {
            log(CONSOLE_INFO, `Streaming, close event, buffer lenght:${buffer.length}`);
            if (!error) {
                if (cleanArray) {
                    sendData(buffer, true);
                } else {
                    sendData(JSON.stringify(buffer), true);
                }
            }
            buffer = [];
            closeConnection();
            resolve({ success: true });
        });

        stream?.on("end", function () {
            log(CONSOLE_INFO, `Streaming, end event`);
            stream.destroy();
        });

        stream?.on("error", function (err: any) {
            error = true;
            log(CONSOLE_INFO, `Streaming, error event`, err);
            reject({ success: false, msg: err });
        });

        stream?.on("data", function (data: any) {
            buffer.push(data);

            if (buffer.length > DB_FETCH_SIZE) {
                if (cleanArray) {
                    sendData(buffer, false);
                } else {
                    sendData(JSON.stringify(buffer), false);
                }
                buffer = [];
            }
        });

        stream?.on("metadata", function (metadata: any) {
            log(CONSOLE_INFO, `Streaming, metadata event`);
            if (!skipMeta) {
                buffer.push(metadata);
            }
        });
    });
}
