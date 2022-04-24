import { ApiInterface } from "@rad-common";

export const aiWebUserRoleApi: ApiInterface = {
    viewName: "AI_WEB_USER_ROLE",
    accessUpdate: ["ACCESS_ADMIN"],
    primaryKey: "ID",
    columns: [
        {
            name: "WEB_USER_ID"
        },
        {
            name: "WEB_ROLE_ID"
        }
    ]
};
