import { app, initHttpConfig, startHttpServer } from "./initDefaultHttp";
import { initOracleDatabaseConnection } from "./utils/initOracleDatabaseConnection";
import { logError, logLine, logStartup } from "@rad-common";
import { streamQuery } from "./utils/streamQuery";
import { generateApi } from "./utils/generateApi";
import { readApiConfig } from "./utils/readApiConfig";
import { getApiConfigs } from "@rad-api";

async function start() {
    await initOracleDatabaseConnection();
    let at = "";

    try {
        // add check for default tables on database connectoin supplied
        // without these we kill server
        // TODO, add grid config table check, not important for POC
        at = "AI_WEB_USER";
        await streamQuery(
            `select ID,FIRSTNAME,LASTNAME,USERNAME,CREATED,CREATED_BY,MODIFIED,MODIFIED_BY from AI_WEB_USER fetch first 1 rows only`,
            [],
            "na",
            "AI_WEB_USER",
            false, // we want meta, normal json does not send meta
            (data) => {
                logStartup("ORACLE ACCESS AI_WEB_USER TEST: ", data.length);
            },
            true, // only need meta data for test
            true
        );

        at = "AI_WEB_ROLE";
        await streamQuery(
            `select ID,NAME,DESCRIPTION,CREATED,CREATED_BY,MODIFIED,MODIFIED_BY from AI_WEB_ROLE fetch first 1 rows only`,
            [],
            "na",
            "AI_WEB_ROLE",
            false, // we want meta, normal json does not send meta
            (data) => {
                logStartup("ORACLE ACCESS AI_WEB_ROLE TEST: ", data.length);
            },
            true, // only need meta data for test
            true
        );
        at = "AI_WEB_USER_ROLE";
        await streamQuery(
            `select ID, WEB_ROLE_ID, WEB_USER_ID,NAME,USERNAME,CREATED,CREATED_BY,MODIFIED,MODIFIED_BY from AI_WEB_USER_ROLE fetch first 1 rows only`,
            [],
            "na",
            "AI_WEB_USER_ROLE",
            false, // we want meta, normal json does not send meta
            (data) => {
                logStartup("ORACLE ACCESS AI_WEB_USER_ROLE TEST: ", data.length);
            },
            true, // only need meta data for test
            true
        );

        at = "AI_WEB_REST_API";
        await streamQuery(
            `select ID,NAME,DATA,ENABLED,CREATED,CREATED_BY,MODIFIED,MODIFIED_BY from AI_WEB_REST_API fetch first 1 rows only`,
            [],
            "na",
            "AI_WEB_REST_API",
            false, // we want meta, normal json does not send meta
            (data) => {
                logStartup("ORACLE API AI_WEB_REST_API TEST: ", data.length);
            },
            true, // only need meta data for test
            true
        );
    } catch (e) {
        logError("ORACLE ACCESS DB ERROR: default tables need to have be added", at);
        logError("ORACLE ACCESS DB ERROR:", e);
        process.exit(1);
    }

    await initHttpConfig();
    startHttpServer();

    const { apis, errors } = readApiConfig(getApiConfigs());

    if (errors.length) {
        errors.forEach((err) => {
            logError(err.apiname, " fails checks, service will be forced to quit, fix error before you try again");
            // todo log out all errors
        });
        process.exit(1);
    }

    apis.forEach((api) => {
        generateApi(app, api);
        logStartup("API added :", api.apiName);
    });

    // TODO: read out dynamic API

    logLine(true);
}
start();
