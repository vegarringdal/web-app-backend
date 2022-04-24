import { ApiInterface } from "../utils/apiInterface";

export const aiWebUserRoleApi: ApiInterface = {
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
