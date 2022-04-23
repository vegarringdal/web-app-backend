import { ConfidentialClientApplication, LogLevel } from "@azure/msal-node";
import {
    AZURE_CLIENT_ID,
    AZURE_SCOPES,
    AZURE_SECRET,
    AZURE_TENDANT_URI,
    IS_DEVELOPMENT,
    SERVER_HOST,
    SERVER_PORT,
    CONSOLE_INFO
} from "../config";
import { log, logError } from "@rad-common";

// Create msal application object
const azureConfig = {
    auth: {
        clientId: AZURE_CLIENT_ID,
        authority: AZURE_TENDANT_URI,
        clientSecret: AZURE_SECRET
    },
    system: {
        loggerOptions: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            loggerCallback(loglevel: any, message: any, _containsPii: any) {
                log(CONSOLE_INFO, loglevel, message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Error
        }
    }
};

// SESSION INFO
export type sessionUserType = {
    name: string;
    id: string;
    roles: string[];
    account: any;
};

export class MsalClient {
    cca: ConfidentialClientApplication;
    sessionid: any;

    constructor(req: any) {
        this.cca = new ConfidentialClientApplication(azureConfig);
        // if we already have it, then set cache
        if (req.session?.azureContext) {
            (this.cca as any).tokenCache.deserialize(req.session.azureContext);
        }
    }

    async updateToken(req, tokenRequest: { code: string; scopes: string[]; redirectUri: string }) {
        try {
            const response = await this.cca.acquireTokenByCode(tokenRequest);

            // add to session, so we know to later

            req.session.user = {
                sessionid: this.sessionid,
                name: (response.idTokenClaims as any).name,
                id: (response.idTokenClaims as any).preferred_username,
                roles: (response.idTokenClaims as any).roles,
                account: response.account
            };
            req.session.azureContext = (this.cca as any).tokenCache.serialize();
            log(CONSOLE_INFO, "redirect resonse account name:", response.account.name);
            log(CONSOLE_INFO, "redirect resonse account expires on:", response.expiresOn);

            return true;
        } catch (error) {
            log(CONSOLE_INFO, "AZURE LOGIN", error);
            req.session.user = null;
            return false;
        }
    }

    login(res) {
        const authCodeUrlParameters = {
            scopes: AZURE_SCOPES,
            redirectUri: IS_DEVELOPMENT ? `http://localhost:${SERVER_PORT}/redirect` : `https://${SERVER_HOST}/redirect`
        };

        // get url to sign user in and consent to scopes needed for application
        this.cca
            .getAuthCodeUrl(authCodeUrlParameters)
            .then((response) => {
                res.redirect(response);
            })
            .catch((error) => logError(JSON.stringify(error)));
    }

    async redirect(req: any, res: any) {
        const tokenRequest = {
            code: req.query.code,
            scopes: AZURE_SCOPES,
            redirectUri: IS_DEVELOPMENT ? `http://localhost:${SERVER_PORT}/redirect` : `https://${SERVER_HOST}/redirect`
        };

        const result = await this.updateToken(req, tokenRequest);

        if (result) {
            res.redirect(
                IS_DEVELOPMENT ? `http://localhost:${SERVER_PORT}/#redirected` : `https://${SERVER_HOST}/#redirected`
            );
        } else {
            res.redirect(
                IS_DEVELOPMENT ? `http://localhost:${SERVER_PORT}/#loginError` : `https://${SERVER_HOST}/#loginError`
            );
        }
    }

    async acquireTokenSilent(req, forceRefresh: boolean) {
        const result = await this.cca.acquireTokenSilent({
            account: req.session.user.account,
            scopes: ["user.read"],
            forceRefresh: forceRefresh
        });

        log(CONSOLE_INFO, "silent name:", result.account.name);
        log(CONSOLE_INFO, "silent expires:", result.expiresOn);
        log(CONSOLE_INFO, "silent now:", new Date().toISOString());
        log(CONSOLE_INFO, "from cache", result.fromCache);
        if (!result.fromCache) {
            log(CONSOLE_INFO, "Account updated", result.account);
        }

        req.session.user = {
            name: (result.account.idTokenClaims as any).name,
            id: (result.account.idTokenClaims as any).preferred_username,
            roles: (result.account.idTokenClaims as any).roles?.map((e) => e.toUpperCase()),
            account: result.account
        };

        return result;
    }
}
