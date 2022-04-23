import path from "path";
import express from "express";
import helmet from "helmet";
import session from "express-session";
import compression from "compression";
import * as zlib from "zlib";
import * as redis from "redis";
import * as StoreConnector from "connect-redis";
import {
    WEB_ROOT,
    SERVER_PORT,
    SESSION_PRIVATE_KEY,
    SESSION_NAME,
    SESSION_DOMAIN,
    SESSION_MAX_AGE,
    IS_DEVELOPMENT,
    PORT_WEB,
    PORT_API,
    SESSION_HTTP_ONLY,
    SESSION_SAME_SITE,
    SERVER_HOST,
    SERVER_COMPRESSION,
    SESSION_SECURE,
    REDIS_URL,
    CONSOLE_INFO
} from "./config";
import { log, logError, logLine, logStartup } from "@rad-common";
import { MsalClient } from "./utils/msal";

/**
 * main application-server express application
 */
export const app = express();

/**
 * init basic modules we need to serve side with session/compression
 */
export async function initHttpConfig() {
    /**
     * Protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
     */
    if (!IS_DEVELOPMENT) {
        app.use(helmet());
    }

    /**
     * use redis for session managment, so we can have many instances running
     */
    const RedisStore = StoreConnector.default(session);
    logStartup("REDIS SERVER:", REDIS_URL);
    const redisClient = redis.createClient({
        legacyMode: true, // todo, need to check why better
        url: REDIS_URL
    });
    const store = new RedisStore({ client: redisClient });
    logStartup("REDIS SERVER: About to connect to redis");

    //
    try {
        await redisClient.connect();
    } catch (err) {
        logError("REDIS SERVER: unable to connect to redis server on startup, is it started, is url correct ?");
        logError("REDIS SERVER ERROR:\n", err);
        process.exit(1);
    }
    logStartup("REDIS SERVER: connect done");

    // now we register standard error handler, TODO: need better error handling than this,,,
    redisClient.on("error", (err) => logError("Redis Client Error", err));

    // allow large updates
    app.use(express.json({ limit: "500mb" }));

    /**
     * session
     */
    app.set("trust proxy", 1); // trust first proxy ?
    app.use(
        session({
            store: store,
            name: SESSION_NAME,
            secret: SESSION_PRIVATE_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: {
                path: "/",
                httpOnly: SESSION_HTTP_ONLY,
                signed: true,
                sameSite: SESSION_SAME_SITE,
                maxAge: SESSION_MAX_AGE,
                domain: SESSION_DOMAIN,
                secure: SESSION_SECURE // only used for production/https
            }
        })
    );

    /**
     * Compression
     */
    if (SERVER_COMPRESSION) {
        app.use(
            compression({
                threshold: 1,
                flush: zlib.constants.Z_SYNC_FLUSH
            })
        );
    }

    /**
     * body parser
     * so we can receive json
     */
    app.use(express.json());

    /**
     * static resources from application build
     */
    app.use("/", express.static(WEB_ROOT));

    /**
     * set cache plugin for each session
     */
    app.use(function (req, res, next) {
        (res as any).__msalClient = new MsalClient(req);
        next();
    });

    app.get("/login", (req, res) => {
        log(CONSOLE_INFO, "Called /login");
        ((res as any).__msalClient as MsalClient).login(res);
    });

    app.get("/redirect", async (req: any, res) => {
        log(CONSOLE_INFO, "Called /redirect");
        ((res as any).__msalClient as MsalClient).redirect(req, res);
    });
}

export function startHttpServer() {
    if (IS_DEVELOPMENT) {
        // when in delvelopment we are only a rest api server, so need to use PORT_API
        app.listen(PORT_API, SERVER_HOST);
        logLine(true);
        logStartup(` ---> Vitejs on http://localhost:${PORT_WEB}`);
        logStartup(` ---> application-server using port: ${PORT_API} for API (vitejs proxy use this)`);
        logStartup(` ---> Running in mode: ${IS_DEVELOPMENT ? "Development" : "Production"}`);
        logLine(true);
    } else {
        app.listen(SERVER_PORT, SERVER_HOST);
        logLine(true);
        logStartup(` ---> Running on http://localhost:${SERVER_PORT}`);
        logStartup(` ---> Serving pages from ${path.join(__dirname, "../", "application")}`);
        logStartup(` ---> Running in mode: ${IS_DEVELOPMENT ? "Development" : "Production"}`);
        logLine(true);
    }
}
