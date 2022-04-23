import { pool } from "./initOracleDatabaseConnection";

export function isValidDatabaseName(dbName: string) {
    return pool && pool[dbName] !== null && pool[dbName] !== undefined;
}
