import { ApiInterface } from "@rad-common";
import { generateProjectCUDSql } from "../utils/generateProjectCUDSql";

function cleanSQl(sql) {
    return sql
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\t/g, " ")
        .replace(/  /g, " ")
        .replace(/  /g, " ")
        .trim();
}

describe("check generateRoleObject", () => {
    test("insert with project code", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY", project: "PROJECT_CODE" } as ApiInterface,
            { __$insert: true, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("insert");
        expect(cleanSQl(sqlString)).toEqual(
            "insert into MY_TABLE( FIRST_NAME, PROJECT_CODE) values( :FIRST_NAME, :PROJECT_CODE)"
        );
    });

    test("insert without project code", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY" } as ApiInterface,
            { __$insert: true, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("insert");
        expect(cleanSQl(sqlString)).toEqual("insert into MY_TABLE( FIRST_NAME) values( :FIRST_NAME)");
    });

    test("insert without project code, multiple props", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME", "LAST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY" } as ApiInterface,
            { __$insert: true, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("insert");
        expect(cleanSQl(sqlString)).toEqual(
            "insert into MY_TABLE( FIRST_NAME, LAST_NAME) values( :FIRST_NAME, :LAST_NAME)"
        );
    });

    test("update with project code", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY", project: "PROJECT_CODE" } as ApiInterface,
            { __$update: true, __$primarykey: 1, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("update");
        expect(cleanSQl(sqlString)).toEqual(
            "update MY_TABLE set FIRST_NAME = :FIRST_NAME where MY_PRIMARY_KEY = :PRIMARY_KEY_VAR and PROJECT_CODE = :PROJECT_CODE"
        );
    });

    test("update without project code", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY" } as ApiInterface,
            { __$update: true, __$primarykey: 1, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("update");
        expect(cleanSQl(sqlString)).toEqual(
            "update MY_TABLE set FIRST_NAME = :FIRST_NAME where MY_PRIMARY_KEY = :PRIMARY_KEY_VAR"
        );
    });

    test("update without project code, multiple props", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME", "LAST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY" } as ApiInterface,
            { __$update: true, __$primarykey: 1, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("update");
        expect(cleanSQl(sqlString)).toEqual(
            "update MY_TABLE set FIRST_NAME = :FIRST_NAME, LAST_NAME = :LAST_NAME where MY_PRIMARY_KEY = :PRIMARY_KEY_VAR"
        );
    });

    test("delete with project code", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY", project: "PROJECT_CODE" } as ApiInterface,
            { __$delete: true, __$primarykey: 1, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("delete");
        expect(cleanSQl(sqlString)).toEqual(
            "delete from MY_TABLE where MY_PRIMARY_KEY = :PRIMARY_KEY_VAR and PROJECT_CODE = :PROJECT_CODE"
        );
    });

    test("delete without project code", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY" } as ApiInterface,
            { __$delete: true, __$primarykey: 1, FIRST_NAME: "FIRST", LAST_NAME: "LAST" }
        );

        expect(type).toEqual("delete");
        expect(cleanSQl(sqlString)).toEqual("delete from MY_TABLE where MY_PRIMARY_KEY = :PRIMARY_KEY_VAR");
    });

    test("delete missing PRIMARY_KEY_VAR will not generate sql", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY" } as ApiInterface,
            { __$delete: true, LAST_NAME: "LAST" }
        );

        expect(type).toEqual(null);
        expect(cleanSQl(sqlString)).toEqual("");
    });

    test("update missing PRIMARY_KEY_VAR will not generate sql", () => {
        const [sqlString, type] = generateProjectCUDSql(
            ["FIRST_NAME"],
            { viewName: "MY_TABLE", primaryKey: "MY_PRIMARY_KEY" } as ApiInterface,
            { __$update: true, LAST_NAME: "LAST" }
        );

        expect(type).toEqual(null);
        expect(cleanSQl(sqlString)).toEqual("");
    });
});
