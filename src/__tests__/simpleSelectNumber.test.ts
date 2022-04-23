import { getSqlWhereString } from "../utils/getSqlWhereString";

describe("simple select TEXT", () => {
    /***********************************************************************
     * TEST..
     */

    test("BEGIN_WITH", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "BEGIN_WITH",
                    value: "007900"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) like upper(:1))`);

        expect(result.sqlBindings).toEqual(["007900%"]);
    });

    /***********************************************************************
     * TEST..
     */

    test("CONTAINS", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "CONTAINS",
                    value: "007900"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) like upper(:1))`);

        expect(result.sqlBindings).toEqual(["%007900%"]);
    });
    /***********************************************************************
     * not something you normally would use
     */

    test("DOES_NOT_CONTAIN", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "DOES_NOT_CONTAIN",
                    value: 1
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) not like upper(:1) or PROJECT_CODE is null)`);

        expect(result.sqlBindings).toEqual(["%1%"]);
    });

    /***********************************************************************
     * TEST..
     */

    test("END_WITH", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "END_WITH",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) like upper(:1))`);

        expect(result.sqlBindings).toEqual(["%10"]);
    });

    /***********************************************************************
     * TEST..
     */

    test("EQUAL", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "EQUAL",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) = :1)`);

        expect(result.sqlBindings).toEqual([10]);
    });

    /***********************************************************************
     * TEST..
     */

    test("GREATER_THAN", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "GREATER_THAN",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) > :1)`);

        expect(result.sqlBindings).toEqual([10]);
    });

    /***********************************************************************
     * TEST..
     */

    test("GREATER_THAN_OR_EQUAL_TO", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "GREATER_THAN_OR_EQUAL_TO",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) >= :1)`);

        expect(result.sqlBindings).toEqual([10]);
    });

    /***********************************************************************
     * TEST..
     */

    test("IN", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "IN",
                    value: [10, 101] as any
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `((1, upper(PROJECT_CODE)) IN ((1, :1),(1, :2)))`);

        expect(result.sqlBindings).toEqual([10, 101]);
    });

    /***********************************************************************
     * TEST..
     */

    test("NOT_IN", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "NOT_IN",
                    value: [10, 101] as any
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `((1, upper(PROJECT_CODE)) NOT IN ((1, :1),(1, :2)))`);

        expect(result.sqlBindings).toEqual([10, 101]);
    });

    /***********************************************************************
     * TEST..
     */

    test("IS_BLANK", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "IS_BLANK",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) is null or PROJECT_CODE = 0)`);

        expect(result.sqlBindings).toEqual(null);
    });

    /***********************************************************************
     * TEST..
     */

    test("IS_NOT_BLANK", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "IS_NOT_BLANK",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) is not null and PROJECT_CODE != 0)`);

        expect(result.sqlBindings).toEqual(null);
    });

    /***********************************************************************
     * TEST..
     */

    test("LESS_THAN", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "LESS_THAN",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) < :1)`);

        expect(result.sqlBindings).toEqual([10]);
    });

    /***********************************************************************
     * TEST..
     */

    test("LESS_THAN_OR_EQUAL_TO", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "LESS_THAN_OR_EQUAL_TO",
                    value: 10
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) <= :1)`);

        expect(result.sqlBindings).toEqual([10]);
    });

    /***********************************************************************
     * TEST..
     */

    test("LESS_THAN_OR_EQUAL_TO", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "number",
                    operator: "NOT_EQUAL_TO",
                    value: "007900"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) != upper(:1) or PROJECT_CODE is null)`);

        expect(result.sqlBindings).toEqual(["007900"]);
    });
});
