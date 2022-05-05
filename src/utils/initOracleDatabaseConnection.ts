import { logError, logLine, logStartup } from "@rad-common";
import {
    DB_USERNAME,
    DB_PASSWORD,
    DB_CONNECTION_STRING,
    DB_POOL_MAX,
    DB_POOL_MIN,
    DB_POOL_PING_INTERVAL,
    DB_POOL_TIMEOUT
} from "../config";
import OracleDB from "oracledb";
import { DB_FETCH_SIZE, DB_PREFETCH_SIZE } from "../config";

// Oracle constans we need to set
OracleDB.outFormat = OracleDB.OUT_FORMAT_ARRAY; // use less memory server side and client side by using the array, espesially client side
OracleDB.fetchArraySize = DB_FETCH_SIZE; // keep low to keep server memory load low
OracleDB.prefetchRows = DB_PREFETCH_SIZE; // keep low to keep server memory load low
process.env.ORA_SDTZ = "UTC";
// do not fetch date as string, will only create issues when we loose timestamp/zone
OracleDB.fetchAsString = [OracleDB.NUMBER, OracleDB.CLOB]; // stringfy will break these anyway, and number will be wrong if we dont do this
OracleDB.extendedMetaData = true;

// this will hold our pool connections
export let pool: OracleDB.Pool;
export async function initOracleDatabaseConnection() {
    logLine(true);
    logStartup("ORACLEDB: Creating connection pool");
    try {
        pool = await OracleDB.createPool({
            user: DB_USERNAME,
            password: DB_PASSWORD,
            connectString: DB_CONNECTION_STRING,
            poolMax: DB_POOL_MAX,
            poolMin: DB_POOL_MIN,
            poolTimeout: DB_POOL_TIMEOUT,
            poolPingInterval: DB_POOL_PING_INTERVAL
        });
        logStartup(`ORACLEDB: Connection pool created`);
    } catch (e) {
        logError(`ORACLEDB: User:`, DB_USERNAME);
        logError(`ORACLEDB: PassFirstLetter:`, DB_PASSWORD[0]);
        logError(`ORACLEDB: ConnectionString:`, DB_CONNECTION_STRING);
    }
    logLine(true);
}
