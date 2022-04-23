import { getSqlWhereString } from "../utils/getSqlWhereString";

describe("Simple AND operator", () => {
    /***********************************************************************
     * TEST..
     */

    test("test1", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "OR",
            filterArguments: [
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "ATTRIBUTE",
                    attribute: "PROJECT_CODE",
                    attributeType: "text",
                    operator: "EQUAL",
                    value: "PROJECT_CODE"
                },
                {
                    type: "CONDITION",
                    logicalOperator: "NONE",
                    valueType: "VALUE",
                    attribute: "WORKLIST_ID",
                    attributeType: "number",
                    operator: "GREATER_THAN",
                    value: 50171
                },
                {
                    type: "GROUP",
                    logicalOperator: "AND",
                    filterArguments: [
                        {
                            type: "CONDITION",
                            logicalOperator: "NONE",
                            valueType: "ATTRIBUTE",
                            attribute: "PROJECT_CODE",
                            attributeType: "text",
                            operator: "EQUAL",
                            value: "PROJECT_CODE"
                        },
                        {
                            type: "CONDITION",
                            logicalOperator: "NONE",
                            valueType: "VALUE",
                            attribute: "WORKLIST_ID",
                            attributeType: "number",
                            operator: "GREATER_THAN",
                            value: 50171
                        }
                    ]
                }
            ]
        });

        expect(result.sqlString).toEqual(
            /*sql*/ `(upper(PROJECT_CODE) = upper(PROJECT_CODE) OR upper(WORKLIST_ID) > :1 OR (upper(PROJECT_CODE) = PROJECT_CODE AND upper(WORKLIST_ID) > :2))`
        );

        expect(result.sqlBindings).toEqual([50171, 50171]);
    });

    /***********************************************************************
     * TEST..
     */

    test("test3 group in group", () => {
        const result = getSqlWhereString({
            type: "GROUP",
            logicalOperator: "OR",
            filterArguments: [
                {
                    type: "GROUP",
                    logicalOperator: "AND",
                    filterArguments: [
                        {
                            type: "CONDITION",
                            logicalOperator: "NONE",
                            valueType: "ATTRIBUTE",
                            attribute: "PROJECT_CODE",
                            attributeType: "text",
                            operator: "EQUAL",
                            value: "PROJECT_CODE"
                        },
                        {
                            type: "CONDITION",
                            logicalOperator: "NONE",
                            valueType: "VALUE",
                            attribute: "WORKLIST_ID",
                            attributeType: "number",
                            operator: "GREATER_THAN",
                            value: 50171
                        }
                    ]
                },
                {
                    type: "GROUP",
                    logicalOperator: "OR",
                    filterArguments: [
                        {
                            type: "CONDITION",
                            logicalOperator: "NONE",
                            valueType: "ATTRIBUTE",
                            attribute: "PROJECT_CODE",
                            attributeType: "text",
                            operator: "EQUAL",
                            value: "PROJECT_CODE"
                        },
                        {
                            type: "CONDITION",
                            logicalOperator: "NONE",
                            valueType: "VALUE",
                            attribute: "WORKLIST_ID",
                            attributeType: "number",
                            operator: "GREATER_THAN",
                            value: 50172
                        }
                    ]
                }
            ]
        });

        expect(result.sqlString).toEqual(
            /*sql*/ `((upper(PROJECT_CODE) = upper(PROJECT_CODE) AND upper(WORKLIST_ID) > :1) OR (upper(PROJECT_CODE) = PROJECT_CODE OR upper(WORKLIST_ID) > :2))`
        );

        expect(result.sqlBindings).toEqual([50171, 50172]);
    });
});
