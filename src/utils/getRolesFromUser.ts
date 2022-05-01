import { streamQuery } from "./streamQuery";

export async function getRolesFromUser(usename: string) {
    const tempData = [];
    await streamQuery(
        `select NAME from AI_WEB_USER_ROLE where username = :1`,
        [usename],
        "na",
        "AI_WEB_USER",
        true,
        (data) => {
            tempData.push(data);
        }
    );

    return tempData;
}
