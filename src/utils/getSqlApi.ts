import { verifyApiConfig } from "@rad-common";
import { ApiInterface } from "../../../rad-common/src/utils/ApiInterface";
import { logError } from "../../../rad-common/src/utils/log";
import { streamQuery } from "./streamQuery";

const apiCache = new Map<string, ApiInterface>();

setInterval(() => {
    apiCache.clear();
}, 1000 * 60 * 15); // clear cache every 15 min

export async function getApi(apiName: string) {
    if (apiCache.has(apiName)) {
        return apiCache.get(apiName) || null;
    } else {
        await updateApi(apiName);
        if (apiCache.has(apiName)) {
            return apiCache.get(apiName) || null;
        } else {
            return null;
        }
    }
}

export async function updateApi(apiName: string) {
    let api: ApiInterface;
    await streamQuery(
        `select DATA from AI_WEB_REST_API where name = :1 and enabled = '1'`,
        [apiName],
        apiName,
        "AI_WEB_USER_ROLE",
        true,
        (data) => {
            if (Array.isArray(data)) {
                data.forEach((e) => {
                    try {
                        const apiData = JSON.stringify(e[0].DATA);
                        debugger
                        const [apiInterface, apiInterfaceError, errors] = verifyApiConfig(apiData as any);
                        if (errors === 0) {
                            api = apiInterface;
                        } else {
                            logError("updateApi", apiInterfaceError);
                        }
                    } catch (e) {
                        logError("updateApi", e);
                    }
                });
            }
        },
        false,
        true
    );
    if (api) {
        apiCache.set(apiName, api);
    }
}
