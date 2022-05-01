/**
 * Simple route protection for now
 * I have no idea how azure works.. need to check out msal.js
 */

import { CONSOLE_INFO } from "../config";
import { log } from "@rad-common";
import { verifyToken } from "./verifyToken";
import { getRolesFromUser } from "./getRolesFromUser";

export async function protectedRoute(req: any, res: any, next: any) {
    let error = false;

    try {
        const tokenVerified = await verifyToken(req.headers.authorization.split("Bearer ")[1]);
        req.user = {
            name: tokenVerified.name,
            id: tokenVerified.upn,
            roles: tokenVerified.roles
        };

        const result = await getRolesFromUser(tokenVerified.upn);
        const roles = result?.map((e) => e.NAME);
        if (Array.isArray(roles)) {
            req.user.roles = req.user.roles.concat(roles);
        }

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
