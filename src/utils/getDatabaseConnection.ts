import {
    DB_CONNECTION_CLIENT_ID,
    DB_CONNECTION_CLIENT_INFO,
    DB_CONNECTION_DB_OP,
    DB_CONNECTION_MODULE
} from "../config";
import { pool } from "./initOracleDatabaseConnection";

export async function getDatabaseConnection(dbName: string, clientId: string) {
    if (pool[dbName]) {
        const connection = await pool[dbName].getConnection();

        // we add these so DB admin can get info about connected application
        connection.clientId = clientId || DB_CONNECTION_CLIENT_ID;
        connection.clientInfo = DB_CONNECTION_CLIENT_INFO;
        connection.module = DB_CONNECTION_MODULE;
        //connection.action = TODO: add MODIFICATION or SELECT
        connection.dbOp = DB_CONNECTION_DB_OP;

        return connection;
    } else {
        throw `getDatabaseConnection, ${dbName}: pool not ready or unknown`;
    }
}
