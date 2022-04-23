// use data source filter, so we keep it up to date
import type { FilterArgument } from "@simple-html/datasource";
// quickfix, I prob should fix numbers on client side.. but Im lazy atm
import { NumberFormater } from "./numberFormater";

/**
 *
 * @param filter Generates sql sting from @simple-html/datasource filter
 * @returns sql string & argument value array
 */
export function getSqlWhereString(filter: FilterArgument) {
    const sqlBindings: string[] = [];
    let bindCount: number = 0;

    // helper for setting sql binding
    function getBinding(value: any) {
        sqlBindings.push(value);
        bindCount++;
        return `:${bindCount}`;
    }

    if (!filter?.filterArguments?.length) {
        return {
            sqlString: "",
            sqlBindings: sqlBindings.length ? sqlBindings : null
        };
    }

    let isDate = false;
    let isNumber = false;
    let isDateTime = false;

    // helper funtion to limit what characters allowed in columns names to prevent sql injection
    const validateColumnName = function (value: string) {
        if (!/^[A-Za-z_]+$/.test(value)) {
            //check value
            throw "illiegal characters in column name, only allowed [A-Za-z_]";
        } else {
            return value;
        }
    };

    const operatorCheck = function (obj: FilterArgument) {
        const operator = obj.operator;
        let value = obj.value;
        const isAttribute = obj.valueType === "ATTRIBUTE";

        if (obj.attributeType === "date" && obj.valueType !== "ATTRIBUTE") {
            isDate = true;

            // if null value we dont want to make a sql expression
            if (typeof value === "string" && value.toUpperCase() !== "NULL") {
                const date = new Date(obj.value);

                let day = date.getDate().toString();
                if (day.length === 1) {
                    day = "0" + day;
                }

                let month = (date.getMonth() + 1).toString();
                if (month.length === 1) {
                    month = "0" + month;
                }

                value = `to_date('${day}.${month}.${date.getFullYear()}', 'DD.MM.YYYY')`;
            }
        }

        if (obj.attributeType === "number") {
            isNumber = true;
        }

        if (obj.attributeType === "number" && obj.valueType !== "ATTRIBUTE" && value === "") {
            value = 0;
        }

        // spesial case where I need date query based on time also
        if (obj.attributeType === ("dateTime" as any)) {
            if (typeof value === "string") {
                value = new Date(value);
            }
            isDateTime = true;
        }

        /**
         *  next part is just checking operator type, then acting on it
         *  use if statements if you need tenary inside tenary.
         *  else it will be hard to understand
         *  IMPORTANT !!!
         *  all columns must be inside validateColumnName() and values must be inside getBinding()
         *  this will stop sql injections
         */

        /******************************************************************
         * "IS_BLANK"
         */

        if (operator === "IS_BLANK") {
            // for some reason if someone uses round you actually get 0 and not null values
            const numberIs0 = ` or ${validateColumnName(obj.attribute as string)} = 0`;

            return `is null${isNumber ? numberIs0 : ""}`;
        }

        /******************************************************************
         * "IS_NOT_BLANK"
         */

        if (operator === "IS_NOT_BLANK") {
            // for some reason if someone uses round you actually get 0 and not null values
            const numberNot0 = ` and ${validateColumnName(obj.attribute as string)} != 0`;

            return `is not null${isNumber ? numberNot0 : ""}`;
        }

        /******************************************************************
         * "EQUAL"
         */

        if (operator === "EQUAL") {
            if (isDate) {
                if (isAttribute) {
                    return `= ${validateColumnName(value as string)}`;
                } else {
                    return `= ${value}`;
                }
            }

            if (isNumber) {
                if (isAttribute) {
                    return `= ${validateColumnName(value as string)}`;
                } else {
                    if (value !== 0) {
                        return `= ${getBinding(value)}`;
                    } else {
                        // if 0 you usually want blanks..
                        return `= ${getBinding(value)} or ${validateColumnName(obj.attribute)} is null`;
                    }
                }
            }

            return isAttribute ? `= upper(${validateColumnName(value as string)})` : `= upper(${getBinding(value)})`;
        }

        /******************************************************************
         * "LESS_THAN_OR_EQUAL_TO"
         */

        if (operator === "LESS_THAN_OR_EQUAL_TO") {
            if (isDate) {
                return isAttribute ? `<= ${validateColumnName(value as string)}` : `<= ${value}`;
            }

            if (isNumber) {
                return isAttribute ? `<= ${validateColumnName(value as string)}` : `<= ${getBinding(value)}`;
            }

            return isAttribute ? `<= upper(${validateColumnName(value as string)})` : `<= upper(${getBinding(value)})`;
        }

        /******************************************************************
         * "GREATER_THAN_OR_EQUAL_TO"
         */

        if (operator === "GREATER_THAN_OR_EQUAL_TO") {
            if (isDateTime) {
                // just experiment for getting latest updated
                return `>= ${getBinding(value)}`;
            }

            if (isDate) {
                return isAttribute ? `>= ${validateColumnName(value as string)}` : `>= ${value}`;
            }

            if (isNumber) {
                return isAttribute ? `>= ${validateColumnName(value as string)}` : `>= ${getBinding(value)}`;
            }

            return isAttribute ? `>= upper(${validateColumnName(value as string)})` : `>= upper(${getBinding(value)})`;
        }

        /******************************************************************
         * "LESS_THAN"
         */
        if (operator === "LESS_THAN") {
            if (isDate) {
                return isAttribute ? `< ${validateColumnName(value as string)}` : `< ${value}`;
            }

            if (isNumber) {
                return isAttribute ? `< ${validateColumnName(value as string)}` : `< ${getBinding(value)}`;
            }

            return isAttribute ? `< upper(${validateColumnName(value as string)})` : `< upper(${getBinding(value)})`;
        }

        /******************************************************************
         * "GREATER_THAN"
         */
        if (operator === "GREATER_THAN") {
            if (isDate) {
                return isAttribute ? `> ${validateColumnName(value as string)}` : `> ${value}`;
            }

            if (isNumber) {
                return isAttribute ? `> ${validateColumnName(value as string)}` : `> ${getBinding(value)}`;
            }

            return isAttribute ? `> upper(${validateColumnName(value as string)})` : `> upper(${getBinding(value)})`;
        }

        /******************************************************************
         * "CONTAINS"
         */
        if (operator === "CONTAINS") {
            if (isDate) {
                // if its date we overlook whatever they give us, since it supposed to give us date..
                return isAttribute ? `>= ${validateColumnName(value as string)}` : `>= ${value}`;
            }

            return isAttribute
                ? `like upper('%'||${validateColumnName(value as string)}||'%')`
                : `like upper(${getBinding("%" + value + "%")})`;
        }

        /******************************************************************
         * "NOT_EQUAL_TO"
         */
        if (operator === "NOT_EQUAL_TO") {
            if (isDate) {
                if (isAttribute) {
                    return `!= ${validateColumnName(value as string)}  or ${validateColumnName(
                        obj.attribute as string
                    )} is null`;
                }

                // not null, then we also need to return null values
                return `!= ${value} or ${validateColumnName(obj.attribute as string)} is null`;
            }

            if (isAttribute) {
                return `!= upper(${validateColumnName(value as string)})  or ${validateColumnName(
                    obj.attribute as string
                )} is null`;
            }

            // not null, then we also need to return null values
            return `!= upper(${getBinding(value)}) or ${validateColumnName(obj.attribute as string)} is null`;
        }

        /******************************************************************
         * "DOES_NOT_CONTAIN"
         */
        if (operator === "DOES_NOT_CONTAIN") {
            if (isDate) {
                // if its date we overlook whatever they give us, since it supposed to give us date..
                return isAttribute ? `< ${validateColumnName(value as string)}` : `< ${value}`;
            }

            return isAttribute
                ? `not like upper('%'||${validateColumnName(value as string)}||'%') or ${validateColumnName(
                      obj.attribute as string
                  )} is null`
                : `not like upper(${getBinding("%" + value + "%")}) or ${validateColumnName(
                      obj.attribute as string
                  )} is null`;
        }

        /******************************************************************
         * "BEGIN_WITH"
         */
        if (operator === "BEGIN_WITH") {
            if (isDate) {
                // if its date we overlook whatever they give us, since it supposed to give us date..
                return isAttribute ? `>= ${validateColumnName(value as string)}` : `>= ${value}`;
            }

            return isAttribute
                ? `like upper(${validateColumnName(value as string)}) || '%'`
                : `like upper(${getBinding(value + "%")})`;
        }

        /******************************************************************
         * "END_WITH"
         */
        if (operator === "END_WITH") {
            if (isDate) {
                // if its date we overlook whatever they give us, since it supposed to give us date..
                return isAttribute ? `<= ${validateColumnName(value as string)}` : `<= ${value}`;
            }

            return isAttribute
                ? `like '%' || upper(${validateColumnName(value as string)})`
                : `like upper(${getBinding("%" + value)})`;
        }

        return "=";
    };

    const parser = function (obj: FilterArgument, qs = "") {
        if (obj) {
            if (!obj.filterArguments || (obj.filterArguments && obj.filterArguments.length === 0)) {
                const columnName = validateColumnName(obj.attribute as string);

                if (obj.operator !== "IN" && obj.operator !== "NOT_IN") {
                    if (obj.attributeType === ("dateTime" as any)) {
                        // spesial case where I use entire date string..
                        // I only use this for getting modified
                        qs = qs + `${columnName} ${operatorCheck(obj)}`;
                    } else {
                        qs = qs + `upper(${columnName}) ${operatorCheck(obj)}`;
                    }
                } else {
                    let haveNULL = false;
                    // split newline into array

                    const columnName = validateColumnName(obj.attribute as string);
                    const operator = obj.operator === "IN" ? "IN" : "NOT IN";
                    let value;

                    if (Array.isArray(obj.value)) {
                        value = obj.value.map((val) => {
                            // this is just to know if we need to add "is null" or "is not null" at the end
                            if (!val || val === "NULL") {
                                haveNULL = true;
                            }
                            if (obj.attributeType === "number") {
                                return `(1, ${getBinding(NumberFormater.toNumber(val))})`;
                            }
                            if (obj.attributeType === "date") {
                                return `(1, to_date(${getBinding(val)}, 'DD.MM.YYYY'))`;
                            }
                            return `(1, ${getBinding(val)})`;
                        });
                    } else {
                        value = (obj.value as string).split("\n").map((val) => {
                            // this is just to know if we need to add "is null" or "is not null" at the end
                            if (!val || val === "NULL") {
                                haveNULL = true;
                            }
                            if (obj.attributeType === "number") {
                                return `(1, ${getBinding(NumberFormater.toNumber(val))})`;
                            }
                            if (obj.attributeType === "date") {
                                return `(1, to_date(${getBinding(val)}, 'DD.MM.YYYY'))`;
                            }
                            return `(1, ${getBinding(val)})`;
                        });
                    }

                    qs = qs + `(1, upper(${columnName})) ${operator} (${value})`;

                    if (haveNULL) {
                        if (obj.operator === "IN") {
                            qs = qs + " or " + columnName + " is null)";
                        } else {
                            qs = qs + " and " + columnName + " is not null)";
                        }
                    } else {
                        qs = qs + "";
                    }
                }
            } else {
                obj.filterArguments.forEach((y, i) => {
                    if (i > 0) {
                        qs = qs + ` ${obj.logicalOperator === "AND" ? "AND" : "OR"} `;
                    } else {
                        qs = qs + `(`;
                    }
                    qs = parser(y, qs);
                    if (obj.filterArguments.length - 1 === i) {
                        qs = qs + `)`;
                    }
                });
            }
        }
        return qs;
    };
    return {
        sqlString: parser(filter),
        sqlBindings: sqlBindings.length > 0 ? sqlBindings : null
    };
}
