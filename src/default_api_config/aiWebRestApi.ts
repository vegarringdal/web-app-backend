import { ApiInterface } from "@rad-common";

export const aiWebRestApi: ApiInterface = {
    viewName: "AI_WEB_REST_API",
    accessUpdate: ["API_ADMIN"],
    accessInsert: ["API_ADMIN"],
    accessDelete: ["API_ADMIN"],
    primaryKey: "ID",
    primaryKeyType: "number",
    columns: [
        {
            name: "NAME"
        },
        {
            name: "DATA"
        },
        {
            name: "ENABLED"
        }
    ]
};
