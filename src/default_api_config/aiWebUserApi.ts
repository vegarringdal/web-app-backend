import { ApiInterface } from "@rad-common";

export const aiWebUserApi: ApiInterface = {
    viewName: "AI_WEB_USER",
    accessUpdate: ["ACCESS_ADMIN"],
    accessInsert: ["ACCESS_ADMIN"],
    accessDelete: ["ACCESS_ADMIN"],
    primaryKey: "ID",
    primaryKeyType: "number",
    columns: [
        {
            name: "USERNAME"
        },
        {
            name: "FIRSTNAME"
        },
        {
            name: "LASTNAME"
        }
    ]
};
