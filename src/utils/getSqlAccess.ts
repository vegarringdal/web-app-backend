import { streamQuery } from "../utils/streamQuery";

type roleset = string[];

// TODO: I might want some expire on this..
const sqlUserRoles = new Map<string, roleset>();

export async function getRoles(username: string) {
    if (sqlUserRoles.has(username)) {
        return sqlUserRoles.get(username) || [];
    } else {
        await updateSqlAccess(username);
        if (sqlUserRoles.has(username)) {
            return sqlUserRoles.get(username) || [];
        } else {
            return [];
        }
    }
}

export async function updateSqlAccess(username: string) {
    const roles = [];
    await streamQuery(
        `select NAME from AI_WEB_USER_ROLE where username = :1`,
        [username],
        username,
        "AI_WEB_USER_ROLE",
        true,
        (data) => {
            if (Array.isArray(data)) {
                data.forEach((e) => {
                    if (Array.isArray(e)) {
                        roles.push(e[0]);
                    } else {
                        roles.push(e);
                    }
                });
            }
        }
    );
    sqlUserRoles.set(username, roles);
}
