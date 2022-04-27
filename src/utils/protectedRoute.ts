/**
 * Simple route protection for now
 * I have no idea how azure works.. need to check out msal.js
 */

import { ACTIVATE_AZURE_FAKE_SUCCESS, AZURE_FAKE_ROLES, CONSOLE_INFO } from "../config";
import { log } from "@rad-common";
import { verifyToken } from "./verifyToken";

export async function protectedRoute(req: any, res: any, next: any) {
    let error = false;

    // so we can override if needed
    if (ACTIVATE_AZURE_FAKE_SUCCESS) {
        log(CONSOLE_INFO, "ACTIVATED FAKE USER", "ROLES GIVEN:", AZURE_FAKE_ROLES);

        (req.session as any).user = {
            name: "FAKE USER",
            id: "FAKE USER ID",
            roles: AZURE_FAKE_ROLES
        };
    }

    if (!ACTIVATE_AZURE_FAKE_SUCCESS) {
        try {
            const tokenVerified = await verifyToken(req.headers.authorization.split("Bearer ")[1]);

            (req.session as any).user = {
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
    } else {
        log(CONSOLE_INFO, "Auth using fake user");
    }
    if (!error) {
        next();
    }
}
