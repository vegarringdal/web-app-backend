/**
 * IMPORTANT
 * User config_defaults.ts at root if you need to edit anything
 * You only need to edit this file if you rename these folders src, dist, application-server, application
 */

import * as path from "path";
import {
    toNumber,
    toArray,
    toBool,
    toString,
    DEFAULT_PORT_API,
    DEFAULT_PORT_WEB,
    DEFAULT_SERVER_API_ROOT,
    DEFAULT_SERVER_COMPRESSION,
    DEFAULT_SERVER_HOST,
    DEFAULT_SERVER_PORT,
    DEFAULT_DB_FETCH_SIZE,
    DEFAULT_DB_POOL_MAX,
    DEFAULT_DB_POOL_MIN,
    DEFAULT_DB_POOL_PING_INTERVAL,
    DEFAULT_DB_POOL_TIMEOUT,
    DEFAULT_DB_PREFETCH_SIZE,
    DEFAULT_CONSOLE_INFO,
    DEFAULT_CONSOLE_SELECT,
    DEFAULT_DB_CONNECTION_ACTION,
    DEFAULT_DB_CONNECTION_CLIENT_ID,
    DEFAULT_DB_CONNECTION_CLIENT_INFO,
    DEFAULT_DB_CONNECTION_DB_OP,
    DEFAULT_DB_CONNECTION_MODULE,
    DEFAULT_AZURE_CLIENT_ID,
    DEFAULT_AZURE_SCOPES,
    DEFAULT_AZURE_TENDANT_ID,
    DEFAULT_DB_USERNAME,
    DEFAULT_DB_PASSWORD,
    DEFAULT_DB_CONNECTION_STRING
} from "@rad-common";

declare const DEVELOPMENT: boolean;
let devMode: boolean;
try {
    devMode = DEVELOPMENT;
} catch (err) {
    devMode = globalThis.DEVELOPMENT;
}

// if you change this you also need to edit config for vitejs
export const WEB_ROOT: string = path.join(__dirname, "../../rad-frontend", "dist");
export const IS_DEVELOPMENT: boolean = devMode; // esbuild gives us this one

/**
 *  Rest will be environment variables
 *  add ".env" to application-server folder to use in develpment, will not be used for production
 **/

const ENV = process.env;
// http server, server port is only used when in production
export const SERVER_PORT = toNumber(ENV.SERVER_PORT, DEFAULT_SERVER_PORT);
export const SERVER_HOST = toString(ENV.SERVER_HOST, DEFAULT_SERVER_HOST);
export const SERVER_COMPRESSION = toBool(ENV.SERVER_COMPRESSION, DEFAULT_SERVER_COMPRESSION);
export const SERVER_API_ROOT = toString(ENV.SERVER_API_ROOT, DEFAULT_SERVER_API_ROOT);

// azure
export const AZURE_CLIENT_ID: string = toString(ENV.AZURE_CLIENT_ID, DEFAULT_AZURE_CLIENT_ID);
export const AZURE_TENDANT_ID: string = toString(ENV.AZURE_TENDANT_ID, DEFAULT_AZURE_TENDANT_ID);
export const AZURE_SCOPES: string[] = toArray(ENV.AZURE_SCOPES, DEFAULT_AZURE_SCOPES);

// for develpment only
export const PORT_API = toNumber(ENV.PORT_API, DEFAULT_PORT_API);
export const PORT_WEB = toNumber(ENV.PORT_WEB, DEFAULT_PORT_WEB);

// nodejs_report_react env
export const CONSOLE_INFO = toBool(ENV.CONSOLE_INFO, DEFAULT_CONSOLE_INFO);
export const CONSOLE_SELECT = toBool(ENV.CONSOLE_SELECT, DEFAULT_CONSOLE_SELECT);
export const DB_FETCH_SIZE = toNumber(ENV.DB_FETCH_SIZE, DEFAULT_DB_FETCH_SIZE);
export const DB_PREFETCH_SIZE = toNumber(ENV.DB_PREFETCH_SIZE, DEFAULT_DB_PREFETCH_SIZE);
export const DB_POOL_MAX = toNumber(ENV.DB_POOL_MAX, DEFAULT_DB_POOL_MAX);
export const DB_POOL_MIN = toNumber(ENV.DB_POOL_MIN, DEFAULT_DB_POOL_MIN);
export const DB_POOL_PING_INTERVAL = toNumber(ENV.DB_POOL_PING_INTERVAL, DEFAULT_DB_POOL_PING_INTERVAL);
export const DB_POOL_TIMEOUT = toNumber(ENV.DB_POOL_TIMEOUT, DEFAULT_DB_POOL_TIMEOUT);
export const DB_USERNAME = toString(ENV.DB_USERNAME, DEFAULT_DB_USERNAME);
export const DB_CONNECTION_STRING = toString(ENV.DB_CONNECTION_STRING, DEFAULT_DB_CONNECTION_STRING);
export const DB_PASSWORD = toString(ENV.DB_PASSWORD, DEFAULT_DB_PASSWORD);
export const DB_CONNECTION_CLIENT_ID = toString(ENV.DB_CONNECTION_CLIENT_ID, DEFAULT_DB_CONNECTION_CLIENT_ID);
export const DB_CONNECTION_CLIENT_INFO = toString(ENV.DB_CONNECTION_CLIENT_INFO, DEFAULT_DB_CONNECTION_CLIENT_INFO);
export const DB_CONNECTION_MODULE = toString(ENV.DB_CONNECTION_MODULE, DEFAULT_DB_CONNECTION_MODULE);
export const DB_CONNECTION_DB_OP = toString(ENV.DB_CONNECTION_DB_OP, DEFAULT_DB_CONNECTION_DB_OP);
export const DB_CONNECTION_ACTION = toString(ENV.DB_CONNECTION_ACTION, DEFAULT_DB_CONNECTION_ACTION);
