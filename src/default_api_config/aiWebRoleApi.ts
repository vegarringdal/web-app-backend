import { ApiInterface } from "@rad-common";

export const aiWebRoleApi: ApiInterface = {
    viewName: "AI_WEB_ROLE",
    accessUpdate: ["ACCESS_ADMIN"],
    accessInsert: ["ACCESS_ADMIN"],
    accessDelete: ["ACCESS_ADMIN"],
    primaryKey: "ID",
    primaryKeyType: "number",
    columns: [
        {
            name: "NAME"
        },
        {
            name: "DESCRIPTION"
        }
    ]
};
