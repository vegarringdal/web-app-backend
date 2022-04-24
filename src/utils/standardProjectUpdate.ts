import { generateProjectCUDSql } from "./generateProjectCUDSql";
import { BasicDataHandler } from "./basicDataHandler";
import { log, logLine } from "@rad-common";
import { CONSOLE_SELECT } from "../config";
import { ApiInterface } from "@rad-common";
import { UserRolesInterface } from "./userRolesInterface";

/**
 * This takes care of standard update/new and delete
 * expect req query to include "project"
 * @param req
 * @param res
 * @param dbConnectionName
 * @param tableConfig if projectColumnName is null, then it asumes no project column is used
 * @returns
 */
export async function standardProjectUpdate(
    data: any,
    roles: UserRolesInterface,
    tableConfig: ApiInterface,
    databaseHandler: BasicDataHandler,
    callback: (count: number) => void
) {
    if (!data) {
        databaseHandler.error("missing data");
        return;
    }

    // sort so we get delete, update then inserts
    if (Array.isArray(data)) {
        data = data.sort((a, b) => {
            let A = 0;
            let B = 0;

            switch (true) {
                case a.__$delete === 1:
                    A = 1;
                    break;
                case a.__$update === 1:
                    A = 2;
                    break;
                case a.__$insert === 1:
                    A = 3;
                    break;
            }

            switch (true) {
                case b.__$delete === 1:
                    B = 1;
                    break;
                case b.__$update === 1:
                    B = 2;
                    break;
                case b.__$insert === 1:
                    B = 3;
                    break;
            }

            return A - B;
        });
    }

    // check access
    // TODO

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const isDelete = Object.keys(row).includes("__$delete");
            if (isDelete && roles.DELETE !== true) {
                databaseHandler.error("missing delete access", `access denied, missing delete access`);
                return;
            }
            const isUpdate = Object.keys(row).includes("__$update");
            if (isUpdate && roles.UPDATE !== true) {
                databaseHandler.error("missing update access", `access denied, missing update access`);
                return;
            }
            const isInsert = Object.keys(row).includes("__$insert");
            if (isInsert && roles.INSERT !== true) {
                databaseHandler.error("missing insert access", `access denied, missing insert access`);
                return;
            }

            // lets make sure its one of these before we continue
            if (!isInsert && !isUpdate && !isDelete) {
                databaseHandler.error("not insert/update or delete", `access denied, not valid code`);
                return;
            }
        }
    }

    // now that we have done some error checking we can open database connection
    try {
        await databaseHandler.createDBConnection();
    } catch (err) {
        databaseHandler.rollbackAndCloseDB();
        databaseHandler.error("get connection failed");
        return;
    }

    try {
        // if we throw inside this try/catch we cause rollback

        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                let row = data[i];

                const [sqlString, type] = generateProjectCUDSql(
                    roles.UPDATABLE_COLUMNS || [], //  TODO: I need to filter out readonly columns before I run this..
                    tableConfig.viewName,
                    tableConfig.primaryKey,
                    row
                );

                // make sure if found one of these after generating code too
                if (type !== "insert" && type !== "update" && type !== "delete") {
                    throw new Error("request is not insert/update or delete, access denied");
                }

                // clean up internal row variables, so oracle dont complain
                // object can not contain something we dont use in sql
                //"__$delete", "__$update", "__$insert" <- these gets cleared now
                // this is why we do this after sql generate

                const dataKeys = Object.keys(row);
                const allowedKeys = roles.UPDATABLE_COLUMNS.filter((e) => {
                    if (dataKeys.includes(e)) {
                        // if it also is in current object we add it
                        return true;
                    }

                    return false;
                });

                if (allowedKeys.length === 0) {
                    // if we do not have any of allowed key, then lets kill it right away
                    if (type === "update") {
                        // this will cause rollback
                        throw new Error("not allowed to update without column data");
                    }
                }

                // always allow primary key, needed for delete and update
                allowedKeys.push("PRIMARY_KEY_VAR");

                // this clean the client data
                const cleanData = {};
                allowedKeys.forEach((att) => {
                    cleanData[att] = row[att];
                });
                row = cleanData;

                if (type === "insert") {
                    // we dont need this for inserts,
                    // user will supply this, or its autogenerated..
                    delete row.PRIMARY_KEY_VAR;
                }

                if (sqlString) {
                    // todo: make own for updates

                    logLine(CONSOLE_SELECT);
                    log(CONSOLE_SELECT, "Update/insert/delete sql:");
                    log(CONSOLE_SELECT, "---------------------------------------");
                    log(CONSOLE_SELECT, "SQL:");
                    log(CONSOLE_SELECT, "---------------------------------------");
                    log(CONSOLE_SELECT, "\n   Info:  " + sqlString.split("\n").join("\n   Info:  "));
                    log(CONSOLE_SELECT, "---------------------------------------");
                    log(CONSOLE_SELECT, "SQL_BINDINGS:");
                    log(CONSOLE_SELECT, "---------------------------------------");
                    log(CONSOLE_SELECT, row);
                    logLine(CONSOLE_SELECT);

                    // send to database
                    await databaseHandler.execute(sqlString, row);
                    callback(i);
                }
            }

            // we are done looping, lest commit our data
            await databaseHandler.commitAndCloseDB();
        }
    } catch (err) {
        // if any errors happend need to roll back
        await databaseHandler.rollbackAndCloseDB();
        databaseHandler.error("save failed", err.message);
        return;
    }

    databaseHandler.done();
}
