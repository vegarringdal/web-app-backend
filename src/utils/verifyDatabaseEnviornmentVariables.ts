import { logError } from "@rad-common";
import {
    DB_CONNECTIONS_NAMES_ARRAY,
    DB_USERNAME_ARRAY,
    DB_CONNECTION_STRING_ARRAY,
    DB_PASSWORD_ARRAY
} from "../config";

/**
 * Next part is just to verify our database connections
 * Just to make sure arrays are same size
 */

export function verifyDatabaseEnvironmentVariables() {
    const ShouldBeLength = DB_CONNECTIONS_NAMES_ARRAY.length;

    let failedTesting = false;
    const ENV = process.env;

    // first 3 is testing default view/schema/view used for default page
    if (!ENV.DEFAULT_VIEW_DB_NAME) {
        failedTesting = true;
        logError("ERROR:", "VITE_DEFAULT_DB_NAME missing");
    }
    if (!ENV.DEFAULT_VIEW_DB_SCHEMA) {
        failedTesting = true;
        logError("ERROR:", "DEFAULT_VIEW_DB_SCHEMA missing");
    }
    if (!ENV.DEFAULT_VIEW_DB_OBJECT) {
        failedTesting = true;
        logError("ERROR:", "DEFAULT_VIEW_DB_OBJECT missing");
    }

    if (ShouldBeLength !== DB_USERNAME_ARRAY.length) {
        failedTesting = true;
        logError("ERROR:", "DB_CONNECTIONS_NAMES_ARRAY and DB_USERNAME_ARRAY length not the same");
    }
    if (ShouldBeLength !== DB_CONNECTION_STRING_ARRAY.length) {
        failedTesting = true;
        logError("ERROR:", "DB_CONNECTIONS_NAMES_ARRAY and DB_CONNECTION_STRING_ARRAY length not the same");
    }
    if (ShouldBeLength !== DB_PASSWORD_ARRAY.length) {
        failedTesting = true;
        logError("ERROR:", "DB_CONNECTIONS_NAMES_ARRAY and DB_PASSWORD_ARRAY length not the same");
    }

    for (let i = 0; i < DB_CONNECTIONS_NAMES_ARRAY.length; i++) {
        const dbName = DB_CONNECTIONS_NAMES_ARRAY[i];

        if (!process.env[DB_USERNAME_ARRAY[i]]) {
            failedTesting = true;
            logError("ERROR:", DB_USERNAME_ARRAY[i], "is missing value", dbName);
        }

        if (!process.env[DB_PASSWORD_ARRAY[i]]) {
            failedTesting = true;
            logError("ERROR:", DB_PASSWORD_ARRAY[i], "is missing value", dbName);
        }

        if (!process.env[DB_CONNECTION_STRING_ARRAY[i]]) {
            failedTesting = true;
            logError("ERROR:", DB_CONNECTION_STRING_ARRAY[i], "is missing value", dbName);
        }
    }

    if (failedTesting) {
        logError("\n\nERROR: Database environment variables is missing data/have errors!\n");
        process.exit(1);
    }
}
