import {
    DB_CONNECTION_CLIENT_ID,
    DB_CONNECTION_CLIENT_INFO,
    DB_CONNECTION_DB_OP,
    DB_CONNECTION_MODULE
} from "../config";
import { pool } from "./initOracleDatabaseConnection";

export async function getDatabaseConnection(clientId: string, action: "READ" | "MODIFY") {
    if (pool) {
        const connection = await pool.getConnection();

        // we add these so DB admin can get info about connected application
        connection.clientId = clientId || DB_CONNECTION_CLIENT_ID;
        connection.clientInfo = DB_CONNECTION_CLIENT_INFO;
        connection.module = DB_CONNECTION_MODULE;
        connection.action = action;
        connection.dbOp = DB_CONNECTION_DB_OP;

        return connection;
    } else {
        throw `getDatabaseConnection, pool not ready or unknown`;
    }
}
