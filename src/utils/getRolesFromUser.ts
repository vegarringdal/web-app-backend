import { streamQuery } from "./streamQuery";

export async function getRolesFromUser(usename: string) {
    // we could have cached it here, so we dont call databse for each api call..

    const tempData = [];
    await streamQuery(
        `select NAME from AI_WEB_USER_ROLE where username = :1`,
        [usename],
        "na",
        "AI_WEB_USER",
        true,
        (data) => {
            if (Array.isArray(data)) {
                data.forEach((e) => tempData.push(e));
            }
        },
        false,
        true
    );

    return tempData;
}
