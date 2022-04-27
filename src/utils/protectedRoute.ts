/**
 * Simple route protection for now
 * I have no idea how azure works.. need to check out msal.js
 */

import { ACTIVATE_AZURE_FAKE_SUCCESS, AZURE_FAKE_ROLES, CONSOLE_INFO } from "../config";
import { log } from "@rad-common";
import { verifyToken } from "./verifyToken";

export async function protectedRoute(req: any, res: any, next: any) {
    //todo: remove
    // TODO: move...
    // JUST TO FAKE IT
    console.log("auth", req.headers.authorization);
    let error = false;

    if (ACTIVATE_AZURE_FAKE_SUCCESS) {
        log(CONSOLE_INFO, "ACTIVATED FAKE USER", "ROLES GIVEN:", AZURE_FAKE_ROLES);

        (req.session as any).user = {
            name: "FAKE USER",
            id: "FAKE USER ID",
            roles: AZURE_FAKE_ROLES
        };
    } else {
        log(CONSOLE_INFO, "protectedRoute called userSession:", req.session?.name);
    }

    // simple protection for all api, not allowed to call any if not logged in
    // the diffrent api will handle their own access, or I will add it here..

    if (!ACTIVATE_AZURE_FAKE_SUCCESS) {
        try {
            console.log("auth", req.headers.authorization);
            const tokenVerified = await verifyToken(req.headers.authorization.split("Bearer ")[1]);

            (req.session as any).user = {
                name: tokenVerified.name,
                id: tokenVerified.upn,
                roles: tokenVerified.roles
            };
            // todo, verify token
        } catch (x) {
            res.status(401).send({
                success: false,
                message: "autentication failed",
                auth: false
            });
            error = true;
        }
    }
    if (!error) {
        next();
    }
}
