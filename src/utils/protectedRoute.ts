/**
 * Simple route protection for now
 * I have no idea how azure works.. need to check out msal.js
 */

import { CONSOLE_INFO } from "../config";
import { log } from "@rad-common";
import { verifyToken } from "./verifyToken";

export async function protectedRoute(req: any, res: any, next: any) {
    let error = false;

    try {
        const tokenVerified = await verifyToken(req.headers.authorization.split("Bearer ")[1]);
        req.user = {
            name: tokenVerified.name,
            id: tokenVerified.upn,
            roles: tokenVerified.roles
        };
        // todo, verify token
        log(CONSOLE_INFO, "Auth token verified");
    } catch (x) {
        log(CONSOLE_INFO, "Auth token failed verification");
        res.status(401).send({
            success: false,
            message: "autentication failed",
            auth: false
        });
        error = true;
    }

    if (!error) {
        next();
    }
}
