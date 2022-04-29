import { ApiInterface, UserRolesInterface } from "@rad-common";

export function generateRoleObject(
    config: ApiInterface,
    userRoles: string[],
    project_code: string
): UserRolesInterface {
    function isObject(x: any) {
        return typeof x === "object" && !Array.isArray(x) && x !== null;
    }

    const PROJECT_CODE = project_code || "";

    if (!config || !isObject(config) || !userRoles || !Array.isArray(userRoles)) {
        return {
            PROJECT_CODE,
            DELETE: false,
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        };
    }

    let insertAccess = false;
    config.accessInsert?.forEach((role) => {
        if (!insertAccess && typeof role === "string") {
            if (userRoles.includes(role.replace("[PROJECT_CODE]", PROJECT_CODE))) {
                insertAccess = true;
            }
        }
    });

    let deleteAccess = false;
    config.accessDelete?.forEach((role) => {
        if (!deleteAccess && typeof role === "string") {
            if (userRoles.includes(role.replace("[PROJECT_CODE]", PROJECT_CODE))) {
                deleteAccess = true;
            }
        }
    });

    const updatableColumns: string[] = [];

    if (Array.isArray(config.columns)) {
        config.columns.forEach((column) => {
            const updateAccessConfig = config.accessUpdate;
            const updateAccessCol = column.accessUpdate;
            let updateAccessFull = [];
            // if set on column, this overrides default
            if (Array.isArray(updateAccessCol)) {
                updateAccessFull = updateAccessCol;
            } else if (Array.isArray(updateAccessConfig)) {
                updateAccessFull = updateAccessConfig;
            }
            updateAccessFull.filter((role) => {
                if (typeof role === "string") {
                    if (userRoles.includes(role.replace("[PROJECT_CODE]", PROJECT_CODE))) {
                        updatableColumns.push(column.name);
                    }
                }
            });
        });
    }

    return {
        PROJECT_CODE,
        DELETE: deleteAccess,
        INSERT: insertAccess,
        UPDATE: updatableColumns.length > 0,
        UPDATABLE_COLUMNS: updatableColumns
    };
}
