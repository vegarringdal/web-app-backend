import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { AZURE_CLIENT_ID, AZURE_TENDANT_ID } from "../config";

// important, you can not use graph scope, it will not be able to verifytoken if you do..
const customScope = `api://${AZURE_CLIENT_ID}`;

const cache: any = {};

export async function verifyToken(token) {
    try {
        debugger;
        const decodedToken = jwt.decode(token, { complete: true });

        async function getKeys() {
            if (cache.time < new Date(new Date().setHours(new Date().getHours() - 1))) {
                return cache.keys;
            } else {
                const client = jwksClient({
                    jwksUri: `https://login.microsoftonline.com/${AZURE_TENDANT_ID}/discovery/v2.0/keys`
                });

                const keys = await client.getSigningKey(decodedToken.header.kid);
                cache.time = new Date();
                cache.keys = keys.getPublicKey();
                return cache.keys;
            }
        }

        const verifiedToken = jwt.verify(token, await getKeys(), {
            audience: customScope,
            issuer: `https://sts.windows.net/${AZURE_TENDANT_ID}/`
        });

        const now = Math.round(new Date().getTime() / 1000); // in UNIX format
        const checkTimestamp = verifiedToken.iat <= now && verifiedToken.exp >= now ? true : false;
        if (!checkTimestamp) {
            throw "expired token";
        }

        return verifiedToken;
    } catch (err) {
        console.error(err);
        return null;
    }
}
