/**
 * helper funtion to limit what characters allowed in columns names to prevent sql injection
 * @param value
 * @returns
 */

export function validateColumnName(value: string) {
    if (!/^[A-Za-z_0-9]+$/.test(value)) {
        //check value
        throw "illiegal characters in column name, only allowed [A-Za-z_]";
    } else {
        return value;
    }
}
