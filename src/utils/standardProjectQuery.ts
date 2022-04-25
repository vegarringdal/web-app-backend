import { streamQuery } from "../utils/streamQuery";
import { Response } from "express";
import { log, logLine } from "@rad-common";
import { getSqlWhereString } from "../utils/getSqlWhereString";
import { CONSOLE_INFO, CONSOLE_SELECT } from "../config";

export async function standardProjectQuery(
    req: any,
    res: Response<any, Record<string, any>>,
    viewName: string,
    queryOverride?: any
) {
    const { meta, rows, count, format } = req.query;

    log(CONSOLE_INFO, `request meta:`, meta);
    log(CONSOLE_INFO, `request rows:`, rows);
    log(CONSOLE_INFO, `request count:`, count);
    log(CONSOLE_INFO, `request json:`, format);

    // helper for json format check
    function isJsonFormat(value) {
        if (typeof value === "string" && value.toUpperCase() === "JSON") {
            return true;
        } else {
            return false;
        }
    }
    // needed to stream data back/gzip
    const usejson = isJsonFormat(format);

    // todo, add option to not tag data ?
    if (usejson) {
        res.setHeader("Content-Type", "application/json");
    } else {
        res.setHeader("Content-Type", "text/html");
    }

    // quick check
    let maxRows = parseInt(rows);
    if (isNaN(maxRows)) {
        maxRows = 0;
    }

    /**
     * get filter if any and generate sql string
     * depending of project code we wrap or not wrap the sql statement
     */

    let jsonFilter = queryOverride || req.body;
    let whereSql, sqlBindings;
    if (jsonFilter) {
        if (!jsonFilter?.filterArguments && jsonFilter?.attribute) {
            jsonFilter = { filterArguments: [jsonFilter] };
        }
        log(CONSOLE_SELECT, `QUERY INPUT:`);
        log(CONSOLE_SELECT, JSON.stringify(jsonFilter));
        const result = getSqlWhereString(jsonFilter);
        whereSql = result.sqlString;
        sqlBindings = result.sqlBindings;
    }

    let sql = "";
    if (viewName) {
        // todo clean up

        const whereQuery = whereSql ? `where ${whereSql}` : "";
        sql = `from ${viewName} ${whereQuery}`;

        // not very beautiful, but a start
        switch (true) {
            case meta === "1":
                sql = `select * ${sql} where 1 = 0`;
                break;
            case count === "1":
                sql = `select count(*) as count ${sql}`;
                break;
            case rows > 0:
                sql = `select * ${sql} fetch first ${maxRows} rows only`;
                break;
            default:
                sql = `select * ${sql}`;
            //do nothing
        }
    } else {
        // in teory api config will never allow this, but someone might use funtion without the dynamic api
        res.statusMessage = "api config is missing sqlSelect";
        res.status(504).send();
        res.end();
        return;
    }

    log(CONSOLE_SELECT, `--------------------------------------------------`);
    log(CONSOLE_SELECT, `standardProjectQuery:`);
    log(CONSOLE_SELECT, `--------------------------------------------------`);
    log(CONSOLE_SELECT, `Bindings:`);
    log(CONSOLE_SELECT, sqlBindings);
    log(CONSOLE_SELECT, sql.split("\n").join("\n   Info:  "));
    logLine(CONSOLE_SELECT);

    let firstSend = true;
    // reuse report stream utillity class
    await streamQuery(
        sql,
        sqlBindings,
        req.session?.user?.id,
        viewName,
        usejson ? true : false,
        function (data: string, done: boolean) {
            if (usejson) {
                if (firstSend && !done) {
                    data = data.substring(0, data.length - 1);
                    firstSend = false;
                } else {
                    if (firstSend && done) {
                        // do nothing, we need the entire string
                        firstSend = false;
                    } else {
                        if (!done) {
                            data = "," + data.substring(1, data.length - 1);
                        } else {
                            data = "," + data.substring(1, data.length);
                        }
                    }
                }

                res.write(data);
            } else {
                if (firstSend && !done) {
                    data = data.substring(0, data.length - 1);
                    firstSend = false;
                } else {
                    if (firstSend && done) {
                        // do nothing, we need the entire string
                        firstSend = false;
                    } else {
                        if (!done) {
                            data = "," + data.substring(1, data.length - 1);
                        } else {
                            data = "," + data.substring(1, data.length);
                        }
                    }
                }
                res.write(data);
            }
        },
        meta ? true : false
    ).catch((e) => {
        res.statusMessage = e.msg?.message || e.msg;
        res.status(504).send();
        res.end();
        return;
    });
    res.end();
}
