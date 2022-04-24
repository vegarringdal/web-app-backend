import { ApiInterface } from "@rad-common";
import { UserRolesInterface } from "./userRolesInterface";

export function generateRoleObject(config: ApiInterface, userRoles: string[]): UserRolesInterface {
    function isObject(x: any) {
        return typeof x === "object" && !Array.isArray(x) && x !== null;
    }

    if (!config || !isObject(config) || !userRoles || !Array.isArray(userRoles)) {
        return {
            DELETE: false,
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        };
    }

    let insertAccess = false;
    config.accessInsert?.forEach((role) => {
        if (!insertAccess && typeof role === "string") {
            if (userRoles.includes(role)) {
                insertAccess = true;
            }
        }
    });

    let deleteAccess = false;
    config.accessDelete?.forEach((role) => {
        if (!deleteAccess && typeof role === "string") {
            if (userRoles.includes(role)) {
                deleteAccess = true;
            }
        }
    });

    const updatableColumns: string[] = [];

    if (Array.isArray(config.columns)) {
        config.columns.forEach((column) => {
            const updateAccessConfig = config.accessUpdate || [];
            const updateAccessCol = column.accessUpdate || [];
            const updateAccessFull = updateAccessConfig.concat(updateAccessCol);

            updateAccessFull.filter((role) => {
                if (typeof role === "string") {
                    if (userRoles.includes(role)) {
                        updatableColumns.push(column.name);
                    }
                }
            });
        });
    }

    return {
        DELETE: deleteAccess,
        INSERT: insertAccess,
        UPDATE: updatableColumns.length > 0,
        UPDATABLE_COLUMNS: updatableColumns
    };
}
