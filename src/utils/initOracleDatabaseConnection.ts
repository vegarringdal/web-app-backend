import { logError, logLine, logStartup } from "@rad-common";
import {
    DB_CONNECTIONS_NAMES_ARRAY,
    DB_CONNECTION_STRING_ARRAY,
    DB_PASSWORD_ARRAY,
    DB_POOL_MAX,
    DB_POOL_MIN,
    DB_POOL_PING_INTERVAL,
    DB_POOL_TIMEOUT,
    DB_USERNAME_ARRAY
} from "../config";
import OracleDB from "oracledb";
import { DB_FETCH_SIZE, DB_PREFETCH_SIZE } from "../config";
import { verifyDatabaseEnvironmentVariables } from "./verifyDatabaseEnviornmentVariables";

// Oracle constans we need to set
OracleDB.outFormat = OracleDB.OUT_FORMAT_ARRAY; // use less memory server side and client side by using the array, espesially client side
OracleDB.fetchArraySize = DB_FETCH_SIZE; // keep low to keep server memory load low
OracleDB.prefetchRows = DB_PREFETCH_SIZE; // keep low to keep server memory load low

// do not fetch date as string, will only create issues when we loose timestamp/zone
OracleDB.fetchAsString = [OracleDB.NUMBER]; // stringfy will break these anyway, and number will be wrong if we dont do this
OracleDB.extendedMetaData = true;

// this will hold our pool connections
export const pool: {
    [key: string]: OracleDB.Pool;
} = {};

export async function initOracleDatabaseConnection() {
    logLine(true);
    logStartup("ORACLEDB: Verifying environment variables");

    // no need to try and connect if these are broken
    verifyDatabaseEnvironmentVariables();

    logStartup("ORACLEDB: Creating pools");

    // we need to create several pools
    for (let i = 0; i < DB_CONNECTIONS_NAMES_ARRAY.length; i++) {
        const dbName = DB_CONNECTIONS_NAMES_ARRAY[i];

        logStartup(`ORACLEDB: Creating pool ${dbName}`);
        logStartup("ORACLEDB: Username env/value:", DB_USERNAME_ARRAY[i], process.env[DB_USERNAME_ARRAY[i]]);
        logStartup(
            "ORACLEDB: Connection string env/value:",
            DB_CONNECTION_STRING_ARRAY[i],
            process.env[DB_CONNECTION_STRING_ARRAY[i]]
        );

        try {
            pool[dbName] = await OracleDB.createPool({
                user: process.env[DB_USERNAME_ARRAY[i]],
                password: process.env[DB_PASSWORD_ARRAY[i]],
                connectString: process.env[DB_CONNECTION_STRING_ARRAY[i]],
                poolMax: DB_POOL_MAX,
                poolMin: DB_POOL_MIN,
                poolTimeout: DB_POOL_TIMEOUT,
                poolPingInterval: DB_POOL_PING_INTERVAL
            });
            logStartup(`ORACLEDB: Created pool: ${dbName}`);
        } catch (e) {
            logError(`ORACLEDB: Error: ${dbName},`, e);
            logError(`ORACLEDB: User:`, process.env[DB_USERNAME_ARRAY[i]]);
            logError(`ORACLEDB: PassFirstLetter:`, process.env[DB_PASSWORD_ARRAY[i]][0]);
            logError(`ORACLEDB: ConnectionString:`, process.env[DB_CONNECTION_STRING_ARRAY[i]]);
        }
        logLine(true);
    }
}
