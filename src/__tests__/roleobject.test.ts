import { generateRoleObject } from "../utils/generateRoleObject";

describe("check generateRoleObject", () => {
    test("null values config and roles", () => {
        const object = generateRoleObject(null as any, null as any, null as any);
        expect(object).toEqual({
            DELETE: false,
            PROJECT_CODE: "",
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("null values roles only", () => {
        const object = generateRoleObject({} as any, null as any, null as any);
        expect(object).toEqual({
            DELETE: false,
            PROJECT_CODE: "",
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("null values config only", () => {
        const object = generateRoleObject({} as any, [], null as any);
        expect(object).toEqual({
            PROJECT_CODE: "",
            DELETE: false,
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("roles not array ", () => {
        const object = generateRoleObject({} as any, "wow" as any, null as any);
        expect(object).toEqual({
            PROJECT_CODE: "",
            DELETE: false,
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("config not array ", () => {
        const object = generateRoleObject("" as any, [], null as any);
        expect(object).toEqual({
            PROJECT_CODE: "",
            DELETE: false,
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("insert access ", () => {
        const config = {
            accessInsert: ["READ"]
        };

        const object = generateRoleObject(config as any, ["READ"], null as any);
        expect(object).toEqual({
            PROJECT_CODE: "",
            DELETE: false,
            INSERT: true,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("delete ", () => {
        const config = {
            accessDelete: ["READ"]
        };

        const object = generateRoleObject(config as any, ["READ"], null as any);
        expect(object).toEqual({
            PROJECT_CODE: "",
            DELETE: true,
            INSERT: false,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("all with application-common ADMIN ", () => {
        const config = {
            accessDelete: ["ADMIN"],
            accessInsert: ["ADMIN"]
        };

        const object = generateRoleObject(config as any, ["ADMIN"], null as any);
        expect(object).toEqual({
            PROJECT_CODE: "",
            DELETE: true,
            INSERT: true,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    test("replace out [PROJECT_CODE] with project code ", () => {
        const config = {
            accessDelete: ["ADMIN"],
            accessInsert: ["ADMIN_[PROJECT_CODE]"],
            accessUpdate: ["ADMIN"]
        };

        const object = generateRoleObject(config as any, ["ADMIN_007900"], "007900");
        expect(object).toEqual({
            PROJECT_CODE: "007900",
            DELETE: false,
            INSERT: true,
            UPDATE: false,
            UPDATABLE_COLUMNS: []
        });
    });

    // TODO: add more test with columns, so I get to test update access better
});
