import { ApiInterface } from "../../../rad-common/src/utils/ApiInterface";

enum sqlType {
    delete = "delete",
    update = "update",
    insert = "insert"
}

export function generateProjectCUDSql(api: ApiInterface, data: unknown): [string, sqlType] {
    // get keys in whitelist
    const whitelistedColumns = api.columns?.map((e) => e.name) || [];
    const keys = Object.keys(data).filter((v) => whitelistedColumns.indexOf(v) !== -1);
    const primaryKey = api.primaryKey;
    const viewName = api.viewName;

    // check if primary key is included, else its a insert
    // I have "x" prefix on primary, since I will use it in sql code, not allowed to start column with _ $ or #
    const havePrimaryKey = Object.keys(data).includes("PRIMARY_KEY_VAR");
    const isDelete = Object.keys(data).includes("__$delete");
    const isUpdate = Object.keys(data).includes("__$update");
    const isInsert = Object.keys(data).includes("__$insert");

    let sqlString = "";
    let type = null;
    if (keys.length === 0 && !isDelete) {
        sqlString = "";
    } else {
        switch (true) {
            /**
             * DELETE
             */
            case isDelete && !isUpdate && !isInsert && havePrimaryKey:
                type = sqlType.delete;

                if (api.project) {
                    // prettier-ignore
                    sqlString = `delete from \n\t${viewName} \nwhere \n\t${primaryKey} = :${"PRIMARY_KEY_VAR"} and ${api.project} = :${api.project}`;
                } else {
                    sqlString = `delete from \n\t${viewName} \nwhere \n\t${primaryKey} = :${"PRIMARY_KEY_VAR"}`;
                }

                break;
            /**
             * UPDATE
             */
            case isUpdate && !isDelete && !isInsert && havePrimaryKey:
                type = sqlType.update;
                sqlString = `update \n\t${viewName} \nset`;

                keys.forEach((key, i) => {
                    sqlString = sqlString + `${i > 0 ? "," : ""}\n\t${key} = :${key}`;
                });
                if (api.project) {
                    // prettier-ignore
                    sqlString = sqlString + `\nwhere \n\t${primaryKey} = :${"PRIMARY_KEY_VAR"} and ${api.project} = :${api.project}\n`;
                } else {
                    // if not project then its just primary key
                    sqlString = sqlString + `\nwhere \n\t${primaryKey} = :${"PRIMARY_KEY_VAR"}\n`;
                }

                break;
            /**
             * INSERT
             */
            case isInsert && !isDelete && !isUpdate: // we dont need primary key for insert
                type = sqlType.insert;

                let keys_withOrWithoutProject = [];
                if (api.project) {
                    keys_withOrWithoutProject = keys.concat(api.project);
                } else {
                    keys_withOrWithoutProject.push(...keys);
                }

                // prettier-ignore
                sqlString = `insert into ${viewName}(\n\t${
                    keys_withOrWithoutProject
                        .join(",\n\t")}) \nvalues(${
                    keys_withOrWithoutProject
                    .map((v) => "\n\t:" + v)
                    .join(",")})\n`;
            // instead of update does not support returning, so need a workaround for it
        }
    }

    // convert iso date string js date, so orcle undestands it
    keys.forEach((key) => {
        // "2021-04-03T15:40:39.180Z"
        if (
            // chance of this beeing anything but date is very unlikely..
            typeof data[key] === "string" &&
            data[key][10] === "T" &&
            data[key][13] === ":" &&
            data[key][23] === "Z" &&
            data[key].length === 24
        ) {
            data[key] = new Date(data[key]);
        }
    });

    return [sqlString, type];
}
