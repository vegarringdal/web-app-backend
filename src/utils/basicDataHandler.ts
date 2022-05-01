import OracleDB from "oracledb";
import { Response } from "express";
import { getDatabaseConnection } from "./getDatabaseConnection";
import { log, logError } from "@rad-common";
import { CONSOLE_INFO } from "../config";
import { ApiInterface } from "@rad-common";

/**
 * Basic database handler to be used with standardProjectUpdate
 * if you need something in between you can use this to handle it
 */
export class BasicDataHandler {
    dbConnection: OracleDB.Connection;
    res: Response<any, Record<string, any>>;
    viewApi: ApiInterface;
    newRecordKeys: string[] = [];
    skipConnection = false; // helper to skip all update/connection to update during testing
    clientID: string;

    constructor(res: Response<any, Record<string, any>>, viewApi: ApiInterface, clientID: string) {
        this.res = res;
        this.viewApi = viewApi;
        this.clientID = clientID;
    }

    /**
     * ready for connection to be created
     * error handling needs to be handled aoutside
     */
    public async createDBConnection() {
        if (this.skipConnection) {
            log(CONSOLE_INFO, "skipConnection activated, skipping getDbConnection");
        } else {
            this.dbConnection = await getDatabaseConnection(this.clientID, "MODIFY");
        }
    }

    /**
     * handles error and closes request
     * @param statusMessage
     * @param clientErrorMsg
     */
    public error(statusMessage: string, clientErrorMsg?: any) {
        logError(statusMessage, clientErrorMsg);
        this.res.statusMessage = statusMessage;
        this.res.write(`${JSON.stringify({ msg: clientErrorMsg || statusMessage || "" })}`);
        this.res.end();
    }

    /**
     * this will call database
     * @param sqlString
     * @param databindings
     */
    public async execute(sqlString: string, databindings: any) {
        if (this.skipConnection) {
            log(CONSOLE_INFO, "skipConnection activated, skipping execute");
        } else {
            if (this.dbConnection) {
                const x = await this.dbConnection.execute(sqlString, databindings, {
                    resultSet: true
                });

                if (x?.outBinds) {
                    if ((x as any).outBinds["RETURN_KEY"]) {
                        const binds: string[] | number[] = (x as any).outBinds["RETURN_KEY"];
                        this.newRecordKeys.push(binds as never); // why never ?
                    }
                }
            } else {
                throw new Error("execute called without db connection");
            }
        }
    }

    /**
     * commits and closes db connection
     * important you call close to request after
     */
    public async commitAndCloseDB() {
        if (this.skipConnection) {
            log(CONSOLE_INFO, "skipConnection activated, skipping commitAndCloseDB");
        } else {
            if (this.dbConnection) {
                await this.dbConnection.commit();
                await this.dbConnection.close();
            } else {
                throw new Error("commitAndCloseDB called without db connection");
            }
        }
    }

    /**
     * rollbacks and closes db connection
     * important you call close to request after
     */
    public async rollbackAndCloseDB() {
        if (this.skipConnection) {
            log(CONSOLE_INFO, "skipConnection activated, skipping rollbackAndCloseDB");
        } else {
            if (this.dbConnection) {
                await this.dbConnection.rollback();
                await this.dbConnection.close();
            } else {
                throw new Error("rollbackAndCloseDB called without db connection");
            }
        }
    }

    /**
     * All ok, send success message back
     */
    public done() {
        this.res.write(`${JSON.stringify(this.newRecordKeys.flat())}`);
        this.res.end();
    }
}
