import { ApiInterface } from "@rad-common";

export const aiWebRestApi: ApiInterface = {
    viewName: "AI_WEB_REST_API",
    accessUpdate: ["API_ADMIN"],
    primaryKey: "ID",
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
