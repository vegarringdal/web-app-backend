import { initHttpConfig, startHttpServer } from "./initDefaultHttp";
import { initOracleDatabaseConnection } from "./utils/initOracleDatabaseConnection";
import { logLine } from "@rad-common";


async function start() {
    // init database connection
    await initOracleDatabaseConnection();

    // init http server settings
    await initHttpConfig();

    // time to start server
    startHttpServer();

    // TODO -> read out config from database

    // TODO init apis
    logLine(true);
}
start();
