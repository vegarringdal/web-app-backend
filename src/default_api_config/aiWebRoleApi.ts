import { ApiInterface } from "../utils/apiInterface";

export const aiWebRoleApi: ApiInterface = {
    viewName: "AI_WEB_ROLE",
    accessUpdate: ["ACCESS_ADMIN"],
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
