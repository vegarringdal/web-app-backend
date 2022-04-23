import { getSqlWhereString } from "../utils/getSqlWhereString";

describe("simple select DATES", () => {
    /***********************************************************************
     * override what ever they give me if date, and use greater than or eaual
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
                    attributeType: "date",
                    operator: "BEGIN_WITH",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) >= to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
    });

    /***********************************************************************
     * override what ever they give me if date, and use greater than or eaual
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
                    attributeType: "date",
                    operator: "CONTAINS",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) >= to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
    });
    /***********************************************************************
     * override what ever they give me if date, and use less than
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
                    attributeType: "date",
                    operator: "DOES_NOT_CONTAIN",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) < to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
    });

    /***********************************************************************
     * override what ever they give me if date, and use less than or eaual
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
                    attributeType: "date",
                    operator: "END_WITH",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) <= to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
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
                    attributeType: "date",
                    operator: "EQUAL",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) = to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
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
                    attributeType: "date",
                    operator: "GREATER_THAN",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) > to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
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
                    attributeType: "date",
                    operator: "GREATER_THAN_OR_EQUAL_TO",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) >= to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
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
                    attributeType: "date",
                    operator: "IN",
                    value: ["01.01.2020", "01.01.2020"] as any
                }
            ]
        });

        expect(result.sqlString).toEqual(
            /*sql*/ `((1, upper(PROJECT_CODE)) IN ((1, to_date(:1, 'DD.MM.YYYY')),(1, to_date(:2, 'DD.MM.YYYY'))))`
        );

        expect(result.sqlBindings).toEqual(["01.01.2020", "01.01.2020"]);
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
                    attributeType: "date",
                    operator: "NOT_IN",
                    value: ["01.01.2020", "01.01.2020"] as any
                }
            ]
        });

        expect(result.sqlString).toEqual(
            /*sql*/ `((1, upper(PROJECT_CODE)) NOT IN ((1, to_date(:1, 'DD.MM.YYYY')),(1, to_date(:2, 'DD.MM.YYYY'))))`
        );

        expect(result.sqlBindings).toEqual(["01.01.2020", "01.01.2020"]);
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
                    attributeType: "date",
                    operator: "IS_BLANK",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) is null)`);

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
                    attributeType: "date",
                    operator: "IS_NOT_BLANK",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) is not null)`);

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
                    attributeType: "date",
                    operator: "LESS_THAN",
                    value: "10.01.2021"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) < to_date('01.10.2021', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
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
                    attributeType: "date",
                    operator: "LESS_THAN_OR_EQUAL_TO",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(/*sql*/ `(upper(PROJECT_CODE) <= to_date('01.01.2020', 'DD.MM.YYYY'))`);

        expect(result.sqlBindings).toEqual(null);
    });

    /***********************************************************************
     * TEST..
     */

    test("NOT_EQUAL_TO", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "AND",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "PROJECT_CODE",
                    attributeType: "date",
                    operator: "NOT_EQUAL_TO",
                    value: "01.01.2020"
                }
            ]
        });

        expect(result.sqlString).toEqual(
            /*sql*/ `(upper(PROJECT_CODE) != to_date('01.01.2020', 'DD.MM.YYYY') or PROJECT_CODE is null)`
        );

        expect(result.sqlBindings).toEqual(null);
    });
});
