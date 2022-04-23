var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/initDefaultHttp.ts
var import_path = __toESM(require("path"));
var import_express = __toESM(require("express"));
var import_helmet = __toESM(require("helmet"));
var import_express_session = __toESM(require("express-session"));
var import_compression = __toESM(require("compression"));
var zlib = __toESM(require("zlib"));
var redis = __toESM(require("redis"));
var StoreConnector = __toESM(require("connect-redis"));

// src/config.ts
var path = __toESM(require("path"));

// ../rad-common/src/config_defaults.ts
var DEFAULT_SERVER_PORT = 1080;
var DEFAULT_SERVER_HOST = "localhost";
var DEFAULT_SERVER_COMPRESSION = true;
var DEFAULT_SERVER_API_ROOT = "/api";
var DEFAULT_SESSION_MAX_AGE = 3600 * 60 * 60 * 24 * 14;
var DEFAULT_SESSION_DOMAIN = DEFAULT_SERVER_HOST;
var DEFAULT_SESSION_PRIVATE_KEY = "change_me";
var DEFAULT_SESSION_NAME = "session_name";
var DEFAULT_SESSION_HTTP_ONLY = true;
var DEFAULT_SESSION_SAME_SITE = true;
var DEFAULT_PORT_API = 1081;
var DEFAULT_PORT_WEB = 1080;
var DEFAULT_CONSOLE_INFO = false;
var DEFAULT_CONSOLE_SELECT = false;
var DEFAULT_DB_FETCH_SIZE = 150;
var DEFAULT_DB_PREFETCH_SIZE = 150;
var DEFAULT_DB_POOL_MAX = 5;
var DEFAULT_DB_POOL_MIN = 2;
var DEFAULT_DB_POOL_PING_INTERVAL = 60;
var DEFAULT_DB_POOL_TIMEOUT = 120;
var DEFAULT_DB_CONNECTION_CLIENT_ID = "PUBLIC-USER";
var DEFAULT_DB_CONNECTION_CLIENT_INFO = "WWW.SAMPLE.COM";
var DEFAULT_DB_CONNECTION_MODULE = "WWW.SAMPLE.COM";
var DEFAULT_DB_CONNECTION_DB_OP = "WEB-REPORTS";
var DEFAULT_DB_CONNECTION_ACTION = "NA - NOT IN USE -> SENDING REPORT NAME";
var DEFAULT_DB_USERNAME = "TESTDB";
var DEFAULT_DB_PASSWORD = "TESTDB";
var DEFAULT_DB_CONNECTION_STRING = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1522))(CONNECT_DATA=(SERVICE_NAME=xe)))";
var DEFAULT_REDIS_URL = "redis://localhost:6379";
var DEFAULT_AZURE_CLIENT_ID = "UNKNOW ID";
var DEFAULT_AZURE_TENDANT_URI = "WWW.SAMPLE.COM";
var DEFAULT_AZURE_SECRET = "SUPER SECRET";
var DEFAULT_AZURE_SCOPES = ["READ_ONLY"];
var DEFAULT_ACTIVATE_AZURE_FAKE_SUCCESS = false;
var DEFAULT_AZURE_FAKE_ROLES = [];
function toNumber(x, defaultValue) {
  const number = parseInt(x);
  if (isNaN(number)) {
    return defaultValue;
  } else {
    return number;
  }
}
function toBool(x, defaultValue) {
  if (typeof x !== "string") {
    return defaultValue;
  }
  if (x.trim() === "") {
    return defaultValue;
  }
  if (x.toLowerCase() === "true") {
    return true;
  }
  return false;
}
function toArray(x, defaultValue) {
  if (typeof x !== "string") {
    return defaultValue;
  }
  if (x.trim() === "") {
    return defaultValue;
  }
  return x.split(",");
}
function toString(x, defaultValue) {
  if (typeof x !== "string") {
    return defaultValue;
  }
  if (x.trim() === "") {
    return defaultValue;
  }
  return x;
}

// ../rad-common/src/utils/log.ts
function log(print, ...msg) {
  if (print) {
    console.log("   Info: ", ...msg);
  }
}
function logStartup(...msg) {
  console.log("   Start: ", ...msg);
}
function logError(...msg) {
  console.log("   Error: ", ...msg);
}
function logLine(show) {
  if (show)
    console.log("--------------------------------------------------------------");
}

// src/config.ts
var devMode;
try {
  devMode = true;
} catch (err) {
  devMode = globalThis.DEVELOPMENT;
}
var WEB_ROOT = path.join(__dirname, "../../application", "dist");
var IS_DEVELOPMENT = devMode;
var ENV = process.env;
var SERVER_PORT = toNumber(ENV.SERVER_PORT, DEFAULT_SERVER_PORT);
var SERVER_HOST = toString(ENV.SERVER_HOST, DEFAULT_SERVER_HOST);
var SERVER_COMPRESSION = toBool(ENV.SERVER_COMPRESSION, DEFAULT_SERVER_COMPRESSION);
var SERVER_API_ROOT = toString(ENV.SERVER_API_ROOT, DEFAULT_SERVER_API_ROOT);
var SESSION_MAX_AGE = toNumber(ENV.SESSION_MAX_AGE, DEFAULT_SESSION_MAX_AGE);
var SESSION_DOMAIN = toString(ENV.SESSION_DOMAIN, DEFAULT_SESSION_DOMAIN);
var SESSION_PRIVATE_KEY = toString(ENV.SESSION_PRIVATE_KEY, DEFAULT_SESSION_PRIVATE_KEY);
var SESSION_NAME = toString(ENV.SESSION_NAME, DEFAULT_SESSION_NAME);
var SESSION_HTTP_ONLY = toBool(ENV.SESSION_HTTP_ONLY, DEFAULT_SESSION_HTTP_ONLY);
var SESSION_SAME_SITE = toBool(ENV.SESSION_SAME_SITE, DEFAULT_SESSION_SAME_SITE);
var SESSION_SECURE = toBool(ENV.SESSION_SECURE, !IS_DEVELOPMENT);
var REDIS_URL = toString(ENV.REDIS_URL, DEFAULT_REDIS_URL);
var AZURE_CLIENT_ID = toString(ENV.AZURE_CLIENT_ID, DEFAULT_AZURE_CLIENT_ID);
var AZURE_TENDANT_URI = toString(ENV.AZURE_TENDANT_URI, DEFAULT_AZURE_TENDANT_URI);
var AZURE_SECRET = toString(ENV.AZURE_SECRET, DEFAULT_AZURE_SECRET);
var AZURE_SCOPES = toArray(ENV.AZURE_SCOPES, DEFAULT_AZURE_SCOPES);
var ACTIVATE_AZURE_FAKE_SUCCESS = toBool(ENV.ACTIVATE_AZURE_FAKE_SUCCESS, DEFAULT_ACTIVATE_AZURE_FAKE_SUCCESS);
var AZURE_FAKE_ROLES = toArray(ENV.AZURE_FAKE_ROLES, DEFAULT_AZURE_FAKE_ROLES);
var PORT_API = toNumber(ENV.PORT_API, DEFAULT_PORT_API);
var PORT_WEB = toNumber(ENV.PORT_WEB, DEFAULT_PORT_WEB);
var CONSOLE_INFO = toBool(ENV.CONSOLE_INFO, DEFAULT_CONSOLE_INFO);
var CONSOLE_SELECT = toBool(ENV.CONSOLE_SELECT, DEFAULT_CONSOLE_SELECT);
var DB_FETCH_SIZE = toNumber(ENV.DB_FETCH_SIZE, DEFAULT_DB_FETCH_SIZE);
var DB_PREFETCH_SIZE = toNumber(ENV.DB_PREFETCH_SIZE, DEFAULT_DB_PREFETCH_SIZE);
var DB_POOL_MAX = toNumber(ENV.DB_POOL_MAX, DEFAULT_DB_POOL_MAX);
var DB_POOL_MIN = toNumber(ENV.DB_POOL_MIN, DEFAULT_DB_POOL_MIN);
var DB_POOL_PING_INTERVAL = toNumber(ENV.DB_POOL_PING_INTERVAL, DEFAULT_DB_POOL_PING_INTERVAL);
var DB_POOL_TIMEOUT = toNumber(ENV.DB_POOL_TIMEOUT, DEFAULT_DB_POOL_TIMEOUT);
var DB_USERNAME = toString(ENV.DB_USERNAME_ARRAY, DEFAULT_DB_USERNAME);
var DB_CONNECTION_STRING = toString(ENV.DB_CONNECTION_STRING, DEFAULT_DB_CONNECTION_STRING);
var DB_PASSWORD = toString(ENV.DB_PASSWORD, DEFAULT_DB_PASSWORD);
var DB_CONNECTION_CLIENT_ID = toString(ENV.DB_CONNECTION_CLIENT_ID, DEFAULT_DB_CONNECTION_CLIENT_ID);
var DB_CONNECTION_CLIENT_INFO = toString(ENV.DB_CONNECTION_CLIENT_INFO, DEFAULT_DB_CONNECTION_CLIENT_INFO);
var DB_CONNECTION_MODULE = toString(ENV.DB_CONNECTION_MODULE, DEFAULT_DB_CONNECTION_MODULE);
var DB_CONNECTION_DB_OP = toString(ENV.DB_CONNECTION_DB_OP, DEFAULT_DB_CONNECTION_DB_OP);
var DB_CONNECTION_ACTION = toString(ENV.DB_CONNECTION_ACTION, DEFAULT_DB_CONNECTION_ACTION);

// src/utils/msal.ts
var import_msal_node = require("@azure/msal-node");
var azureConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: AZURE_TENDANT_URI,
    clientSecret: AZURE_SECRET
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, _containsPii) {
        log(CONSOLE_INFO, loglevel, message);
      },
      piiLoggingEnabled: false,
      logLevel: import_msal_node.LogLevel.Error
    }
  }
};
var MsalClient = class {
  constructor(req) {
    var _a;
    this.cca = new import_msal_node.ConfidentialClientApplication(azureConfig);
    if ((_a = req.session) == null ? void 0 : _a.azureContext) {
      this.cca.tokenCache.deserialize(req.session.azureContext);
    }
  }
  async updateToken(req, tokenRequest) {
    try {
      const response = await this.cca.acquireTokenByCode(tokenRequest);
      req.session.user = {
        sessionid: this.sessionid,
        name: response.idTokenClaims.name,
        id: response.idTokenClaims.preferred_username,
        roles: response.idTokenClaims.roles,
        account: response.account
      };
      req.session.azureContext = this.cca.tokenCache.serialize();
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
    this.cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
      res.redirect(response);
    }).catch((error) => logError(JSON.stringify(error)));
  }
  async redirect(req, res) {
    const tokenRequest = {
      code: req.query.code,
      scopes: AZURE_SCOPES,
      redirectUri: IS_DEVELOPMENT ? `http://localhost:${SERVER_PORT}/redirect` : `https://${SERVER_HOST}/redirect`
    };
    const result = await this.updateToken(req, tokenRequest);
    if (result) {
      res.redirect(IS_DEVELOPMENT ? `http://localhost:${SERVER_PORT}/#redirected` : `https://${SERVER_HOST}/#redirected`);
    } else {
      res.redirect(IS_DEVELOPMENT ? `http://localhost:${SERVER_PORT}/#loginError` : `https://${SERVER_HOST}/#loginError`);
    }
  }
  async acquireTokenSilent(req, forceRefresh) {
    var _a;
    const result = await this.cca.acquireTokenSilent({
      account: req.session.user.account,
      scopes: ["user.read"],
      forceRefresh
    });
    log(CONSOLE_INFO, "silent name:", result.account.name);
    log(CONSOLE_INFO, "silent expires:", result.expiresOn);
    log(CONSOLE_INFO, "silent now:", new Date().toISOString());
    log(CONSOLE_INFO, "from cache", result.fromCache);
    if (!result.fromCache) {
      log(CONSOLE_INFO, "Account updated", result.account);
    }
    req.session.user = {
      name: result.account.idTokenClaims.name,
      id: result.account.idTokenClaims.preferred_username,
      roles: (_a = result.account.idTokenClaims.roles) == null ? void 0 : _a.map((e) => e.toUpperCase()),
      account: result.account
    };
    return result;
  }
};

// src/initDefaultHttp.ts
var app = (0, import_express.default)();
async function initHttpConfig() {
  if (!IS_DEVELOPMENT) {
    app.use((0, import_helmet.default)());
  }
  const RedisStore = StoreConnector.default(import_express_session.default);
  logStartup("REDIS SERVER:", REDIS_URL);
  const redisClient = redis.createClient({
    legacyMode: true,
    url: REDIS_URL
  });
  const store = new RedisStore({ client: redisClient });
  logStartup("REDIS SERVER: About to connect to redis");
  try {
    await redisClient.connect();
  } catch (err) {
    logError("REDIS SERVER: unable to connect to redis server on startup, is it started, is url correct ?");
    logError("REDIS SERVER ERROR:\n", err);
    process.exit(1);
  }
  logStartup("REDIS SERVER: connect done");
  redisClient.on("error", (err) => logError("Redis Client Error", err));
  app.use(import_express.default.json({ limit: "500mb" }));
  app.set("trust proxy", 1);
  app.use((0, import_express_session.default)({
    store,
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
      secure: SESSION_SECURE
    }
  }));
  if (SERVER_COMPRESSION) {
    app.use((0, import_compression.default)({
      threshold: 1,
      flush: zlib.constants.Z_SYNC_FLUSH
    }));
  }
  app.use(import_express.default.json());
  app.use("/", import_express.default.static(WEB_ROOT));
  app.use(function(req, res, next) {
    res.__msalClient = new MsalClient(req);
    next();
  });
  app.get("/login", (req, res) => {
    log(CONSOLE_INFO, "Called /login");
    res.__msalClient.login(res);
  });
  app.get("/redirect", async (req, res) => {
    log(CONSOLE_INFO, "Called /redirect");
    res.__msalClient.redirect(req, res);
  });
}
function startHttpServer() {
  if (IS_DEVELOPMENT) {
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
    logStartup(` ---> Serving pages from ${import_path.default.join(__dirname, "../", "application")}`);
    logStartup(` ---> Running in mode: ${IS_DEVELOPMENT ? "Development" : "Production"}`);
    logLine(true);
  }
}

// src/utils/initOracleDatabaseConnection.ts
var import_oracledb = __toESM(require("oracledb"));
import_oracledb.default.outFormat = import_oracledb.default.OUT_FORMAT_ARRAY;
import_oracledb.default.fetchArraySize = DB_FETCH_SIZE;
import_oracledb.default.prefetchRows = DB_PREFETCH_SIZE;
import_oracledb.default.fetchAsString = [import_oracledb.default.NUMBER];
import_oracledb.default.extendedMetaData = true;
var pool;
async function initOracleDatabaseConnection() {
  logLine(true);
  logStartup("ORACLEDB: Creating connection pool");
  try {
    pool = await import_oracledb.default.createPool({
      user: DB_USERNAME,
      password: DB_PASSWORD,
      connectString: DB_CONNECTION_STRING,
      poolMax: DB_POOL_MAX,
      poolMin: DB_POOL_MIN,
      poolTimeout: DB_POOL_TIMEOUT,
      poolPingInterval: DB_POOL_PING_INTERVAL
    });
    logStartup(`ORACLEDB: Connection pool created`);
  } catch (e) {
    logError(`ORACLEDB: User:`, DB_USERNAME);
    logError(`ORACLEDB: PassFirstLetter:`, DB_PASSWORD[0]);
    logError(`ORACLEDB: ConnectionString:`, DB_CONNECTION_STRING);
  }
  logLine(true);
}

// src/index.ts
async function start() {
  await initOracleDatabaseConnection();
  await initHttpConfig();
  startHttpServer();
  logLine(true);
}
start();
//# sourceMappingURL=index.js.map
