import { ApiInterface } from "@rad-common";

export const aiWebRoleApi: ApiInterface = {
    viewName: "AI_WEB_ROLE",
    accessUpdate: ["ACCESS_ADMIN"],
    primaryKey: "ID",
    columns: [
        {
            name: "NAME"
        },
        {
            name: "DESCRIPTION"
        }
    ]
};
