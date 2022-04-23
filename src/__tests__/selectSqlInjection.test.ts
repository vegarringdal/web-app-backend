import { getSqlWhereString } from "../utils/getSqlWhereString";

describe("make it fail", () => {
    /***********************************************************************
     * TEST..
     */

    test("protect agains sql injection in column name 1", () => {
        expect(() =>
            getSqlWhereString({
                type: "GROUP",
                logicalOperator: "AND",
                filterArguments: [
                    {
                        type: "CONDITION",
                        logicalOperator: "NONE",
                        valueType: "VALUE",
                        attribute: "PROJECT_CODE",
                        attributeType: "text",
                        operator: "BEGIN_WITH",
                        value: "007900"
                    },
                    {
                        type: "CONDITION",
                        logicalOperator: "NONE",
                        valueType: "VALUE",
                        attribute: ";DROP USERS",
                        attributeType: "number",
                        operator: "GREATER_THAN",
                        value: 50171
                    }
                ]
            })
        ).toThrow("illiegal characters in column name, only allowed [A-Za-z_]");
    });

    /***********************************************************************
     * TEST..
     */

    test("protect agains sql injection in column name when comparing columns", () => {
        expect(() =>
            getSqlWhereString({
                type: "GROUP",
                logicalOperator: "AND",
                filterArguments: [
                    {
                        type: "CONDITION",
                        logicalOperator: "NONE",
                        valueType: "ATTRIBUTE",
                        attribute: "PROJECT_CODE",
                        attributeType: "text",
                        operator: "BEGIN_WITH",
                        value: "PROJECT_CO;DROP TABLE"
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
            })
        ).toThrow("illiegal characters in column name, only allowed [A-Za-z_]");
    });
});
