import { ApiInterface } from "@rad-common";

export const aiWebUserApi: ApiInterface = {
    viewName: "AI_WEB_USER",
    accessUpdate: ["ACCESS_ADMIN"],
    primaryKey: "ID",
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
