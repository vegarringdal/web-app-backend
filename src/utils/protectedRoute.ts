/**
 * Simple route protection for now
 * I have no idea how azure works.. need to check out msal.js
 */

import { ACTIVATE_AZURE_FAKE_SUCCESS, AZURE_FAKE_ROLES, CONSOLE_INFO } from "../config";
import { log } from "@rad-common";
import { MsalClient } from "./msal";

export async function protectedRoute(req: any, res: any, next: any) {
    //todo: remove
    // TODO: move...
    // JUST TO FAKE IT

    let error = false;

    if (ACTIVATE_AZURE_FAKE_SUCCESS) {
        log(CONSOLE_INFO, "ACTIVATED FAKE USER", "ROLES GIVEN:", AZURE_FAKE_ROLES);

        (req.session as any).user = {
            name: "FAKE USER",
            id: "FAKE USER ID",
            roles: AZURE_FAKE_ROLES,
            account: "BLABLA"
        };
    } else {
        log(CONSOLE_INFO, "protectedRoute called userSession:", req.session?.name);
    }

    // simple protection for all api, not allowed to call any if not logged in
    // the diffrent api will handle their own access, or I will add it here..
    if (!req.session.user) {
        res.status(401).send({ success: false, message: "not logged in", auth: false });
        error = true;
    } else {
        if (!ACTIVATE_AZURE_FAKE_SUCCESS) {
            try {
                await ((res as any).__msalClient as MsalClient).acquireTokenSilent(req, false);
            } catch (x) {
                res.status(401).send({
                    success: false,
                    message: "not logged in, could not refresh token",
                    auth: false
                });
                error = true;
            }
        }
        if (!error) {
            next();
        }
    }
}
