import { log, logStartup } from "@rad-common";
import { standardProjectQuery } from "./standardProjectQuery";
import { CONSOLE_INFO } from "../config";
import { getRoles } from "./getSqlAccess";
import { protectedRoute } from "./protectedRoute";
import express from "express";
import { standardProjectUpdate } from "./standardProjectUpdate";
import { BasicDataHandler } from "./basicDataHandler";
import { generateRoleObject } from "./generateRoleObject";
import { ApiInterface } from "@rad-common";

export type User = {
    name: string;
    id: string;
    roles: string[];
};

/**
 * when false we havent initiated the dynamic rest api
 */
let initiatedDefaultApi = false;

/**
 * holds app restapi config, so we can replace them later
 */
const API: Record<string, ApiInterface> = {} as any;

/**
 * creates main reast api methods we need, info, query & update
 * TODO: move to own file?
 * @param app
 */
function initiateDefaultConfig(app: express.Application) {
    {
        /**
         * check authentication
         */
        const API_INFO = `/api/auth`;
        logStartup("API added:", API_INFO);
        app.get(API_INFO, protectedRoute, async function (req: any, res, next) {
            const user = req.user as User;
            const userName = user?.name;
            const userID = user?.id;
            const userAzureRoles = user?.roles;
            const sqlProjectRoles = await getRoles(userID);

            res.status(200).send({
                azureRoles: userAzureRoles,
                allUserRoles: userAzureRoles.concat(sqlProjectRoles),
                user: { userName, userID }
            });
            res.end();
            next();
        });
    }

    {
        /**
         * Gets info about paths registed
         */
        const API_INFO = `/api/all`;
        logStartup("API added:", API_INFO);
        app.get(API_INFO, protectedRoute, async function (req: any, res, next) {
            log(CONSOLE_INFO, "calling api:", API_INFO, req.path);

            const keyName = Object.keys(API);
            const paths = keyName.map((key) => {
                return {
                    path: key
                };
            });
            const user = req.user as User;
            const userName = user?.name;
            const userID = user?.id;
            const userAzureRoles = user?.roles;
            const sqlProjectRoles = await getRoles(userID);

            res.status(200).send({
                paths,
                azureRoles: userAzureRoles,
                allUserRoles: userAzureRoles.concat(sqlProjectRoles),
                user: { userName, userID }
            });
            res.end();
            next();
        });
    }

    {
        /**
         * Gets info about the api
         */
        const API_INFO = `/api/info/*`;
        logStartup("API added:", API_INFO);
        app.get(API_INFO, protectedRoute, express.json(), async function (req: any, res, next) {
            log(CONSOLE_INFO, "calling api:", API_INFO, req.path);

            const name = req.path.replace(API_INFO.replace("*", ""), "");
            const api = API[name];

            if (!api) {
                const statusMessage = "unknown API";
                res.statusMessage = statusMessage;
                res.status(500).send({ msg: statusMessage });
                res.end();
                return;
            }

            const user = req.user as User;
            const userName = user?.name;
            const userID = user?.id;
            const userAzureRoles = user?.roles;
            const sqlProjectRoles = await getRoles(userID);

            const userroles = generateRoleObject(api, userAzureRoles.concat(sqlProjectRoles));

            res.status(200).send({
                api: api,
                apiRoles: userroles,
                allUserRoles: userAzureRoles.concat(sqlProjectRoles),
                user: { userName, userID }
            });
            res.end();
            next();
        });
    }

    {
        /**
         * Query api
         */
        const API_QUERY = `/api/query/*`;
        logStartup("API added:", API_QUERY);
        app.post(API_QUERY, protectedRoute, express.json(), async function (req: any, res, next) {
            log(CONSOLE_INFO, "calling api:", API_QUERY);

            const name = req.path.replace(API_QUERY.replace("*", ""), "");
            const api = API[name];

            if (!api) {
                const statusMessage = "unknown API";
                res.statusMessage = statusMessage;
                res.status(500).send({ msg: statusMessage });
                res.end();
                return;
            }

            await standardProjectQuery(req, res, api.viewName);
            next();
        });
    }

    {
        /**
         * Update api
         */
        const API_UPDATE = `/api/update/*`;
        logStartup("API added:", API_UPDATE);
        app.post(API_UPDATE, protectedRoute, express.json(), async function (req: any, res, next) {
            log(CONSOLE_INFO, "calling api:", API_UPDATE);

            const name = req.path.replace(API_UPDATE.replace("*", ""), "");
            const api = API[name];

            if (!api) {
                const statusMessage = "unknown API";
                res.statusMessage = statusMessage;
                res.status(500).send({ msg: statusMessage });
                res.end();
                return;
            }

            const user = req.user as User;
            const userID = user?.id;
            const userAzureRoles = user?.roles;
            const sqlProjectRoles = await getRoles(userID);

            const userroles = generateRoleObject(api, userAzureRoles.concat(sqlProjectRoles));

            // todo: not very userfriendly, todo, add format JSON...
            res.setHeader("Content-Type", "text/html"); // this should have been plain -> but I need ot figure out how ngninx override in our AKS
            res.setHeader("Cache-Control", "no-cache");

            await standardProjectUpdate(
                req.body,
                userroles,
                api,
                new BasicDataHandler(res, api, userID),
                (count: number) => {
                    res.write(`${count}`);
                }
            );

            next();
        });
    }
}

/**
 * generates api
 * @param app
 * @param api
 */
export function generateApi(app: express.Application, api: ApiInterface) {
    // add to api
    // this is why name also needs to be unique
    // I want to be able to update late, so maybe add version ?
    API[api.apiName] = api;

    if (!initiatedDefaultApi) {
        initiateDefaultConfig(app);
        initiatedDefaultApi = true;
    }
}
