import { ApiInterface } from "@rad-common";

export const aiWebUserRoleApi: ApiInterface = {
    apiName: "WEB_USER_ROLE",
    viewName: "AI_WEB_USER_ROLE",
    accessUpdate: ["ACCESS_ADMIN"],
    accessInsert: ["ACCESS_ADMIN"],
    accessDelete: ["ACCESS_ADMIN"],
    primaryKey: "ID",
    primaryKeyType: "number",
    columns: [
        {
            name: "WEB_USER_ID"
        },
        {
            name: "WEB_ROLE_ID"
        }
    ]
};
