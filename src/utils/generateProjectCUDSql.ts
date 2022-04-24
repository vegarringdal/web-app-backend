enum sqlType {
    delete = "delete",
    update = "update",
    insert = "insert"
}

export function generateProjectCUDSql(
    whitelist: string[],
    viewName: string,
    primaryKey: string,
    data: unknown
): [string, sqlType] {
    // get keys in whitelist
    const keys = Object.keys(data).filter((v) => whitelist.indexOf(v) !== -1);

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
                sqlString = `delete from \n\t${viewName} \nwhere \n\t${primaryKey} = :${"PRIMARY_KEY_VAR"}`;
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

                // if not project then its just primary key
                sqlString = sqlString + `\nwhere \n\t${primaryKey} = :${"PRIMARY_KEY_VAR"}\n`;

                break;
            /**
             * INSERT
             */
            case isInsert && !isDelete && !isUpdate: // we dont need primary key for insert
                type = sqlType.insert;

                sqlString = `insert into ${viewName}(\n\t${keys.join(",\n\t")}) \nvalues(${keys
                    .map((v) => "\n\t:" + v)
                    .join(",")})\nreturning \n\t${primaryKey} into :${"RETURN_KEY"}\n`;
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
