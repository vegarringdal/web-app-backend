import { getSqlWhereString } from "../utils/getSqlWhereString";

describe("Simple test on Timestamp", () => {
    /***********************************************************************
     * This is just something I needed for a Poc
     * grid does not care about time
     * but I needed this for getting updated records
     */

    test("test3", () => {
        const result = getSqlWhereString({
            filterArguments: [
                {
                    attribute: "MODIFIED",
                    attributeType: "dateTime" as any,
                    operator: "GREATER_THAN_OR_EQUAL_TO",
                    value: "2021-05-07T15:05:50.595Z"
                }
            ]
        });
        expect(result.sqlString).toEqual(/*sql*/ `(MODIFIED >= :1)`);
        expect(result.sqlBindings).toEqual([new Date("2021-05-07T15:05:50.595Z")]);
    });
});
