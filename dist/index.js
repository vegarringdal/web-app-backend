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

// ../rad-common/src/utils/numberFormater.ts
var NumberFormater = class {
  static toNumber(value) {
    let returnValue = value;
    if (returnValue === null || returnValue === "undefined") {
      returnValue;
    }
    if (returnValue.includes && returnValue.includes(",") && !returnValue.includes(".")) {
      returnValue = returnValue.replace(",", ".");
    }
    if (isNaN(parseFloat(returnValue))) {
      return 0;
    }
    if (returnValue === "0") {
      return 0;
    }
    return parseFloat(returnValue);
  }
  static fromNumber(value) {
    let returnValue = value;
    if (isNaN(parseFloat(returnValue))) {
      returnValue = "";
    }
    if (returnValue === null || returnValue === void 0) {
      return returnValue;
    }
    if (returnValue.toString().includes(".")) {
      returnValue = returnValue.toString().replace(".", ",");
    }
    return returnValue.toString();
  }
};

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

// src/utils/streamQuery.ts
var import_oracledb2 = __toESM(require("oracledb"));

// src/utils/getDatabaseConnection.ts
async function getDatabaseConnection(clientId) {
  if (pool) {
    const connection = await pool.getConnection();
    connection.clientId = clientId || DB_CONNECTION_CLIENT_ID;
    connection.clientInfo = DB_CONNECTION_CLIENT_INFO;
    connection.module = DB_CONNECTION_MODULE;
    connection.dbOp = DB_CONNECTION_DB_OP;
    return connection;
  } else {
    throw `getDatabaseConnection, pool not ready or unknown`;
  }
}

// src/utils/streamQuery.ts
async function streamQuery(sqlString, sqlBindings, userID, tableNameOrReportName, usejson, sendData, cleanArray = false) {
  return new Promise(async (resolve, reject) => {
    let connection;
    let stream;
    let buffer = usejson || cleanArray ? [] : [new Date()];
    let closed = false;
    let error = false;
    const skipMeta = usejson || cleanArray;
    try {
      log(CONSOLE_INFO, `Streaming, getConnection`);
      connection = await getDatabaseConnection(userID);
      log(CONSOLE_INFO, `Streaming, getConnection OK`);
    } catch (err) {
      log(CONSOLE_INFO, `Streaming, getConnection FAILED:`, err);
      reject({ success: false, msg: err });
      return;
    }
    try {
      log(CONSOLE_INFO, `Streaming, calling queryStream`);
      stream = connection.queryStream(sqlString, sqlBindings, {
        outFormat: usejson && !cleanArray ? import_oracledb2.default.OUT_FORMAT_OBJECT : import_oracledb2.default.OUT_FORMAT_ARRAY
      });
      log(CONSOLE_INFO, `Streaming, queryStream ok`);
    } catch (err) {
      reject({ success: false, msg: err });
    }
    function closeConnection() {
      if (!closed) {
        closed = true;
        process.nextTick(async () => {
          await connection.close();
        });
      }
    }
    stream == null ? void 0 : stream.on("close", function() {
      log(CONSOLE_INFO, `Streaming, close event, buffer lenght:${buffer.length}`);
      if (!error) {
        if (cleanArray) {
          sendData(buffer, true);
        } else {
          sendData(JSON.stringify(buffer), true);
        }
      }
      buffer = [];
      closeConnection();
      resolve({ success: true });
    });
    stream == null ? void 0 : stream.on("end", function() {
      log(CONSOLE_INFO, `Streaming, end event`);
      stream.destroy();
    });
    stream == null ? void 0 : stream.on("error", function(err) {
      error = true;
      log(CONSOLE_INFO, `Streaming, error event`, err);
      reject({ success: false, msg: err });
    });
    stream == null ? void 0 : stream.on("data", function(data) {
      buffer.push(data);
      if (buffer.length > DB_FETCH_SIZE) {
        if (cleanArray) {
          sendData(buffer, false);
        } else {
          sendData(JSON.stringify(buffer), false);
        }
        buffer = [];
      }
    });
    stream == null ? void 0 : stream.on("metadata", function(metadata) {
      log(CONSOLE_INFO, `Streaming, metadata event`);
      if (!skipMeta) {
        buffer.push(metadata);
      }
    });
  });
}

// src/utils/getSqlWhereString.ts
function getSqlWhereString(filter) {
  var _a;
  const sqlBindings = [];
  let bindCount = 0;
  function getBinding(value) {
    sqlBindings.push(value);
    bindCount++;
    return `:${bindCount}`;
  }
  if (!((_a = filter == null ? void 0 : filter.filterArguments) == null ? void 0 : _a.length)) {
    return {
      sqlString: "",
      sqlBindings: sqlBindings.length ? sqlBindings : null
    };
  }
  let isDate = false;
  let isNumber = false;
  let isDateTime = false;
  const validateColumnName = function(value) {
    if (!/^[A-Za-z_]+$/.test(value)) {
      throw "illiegal characters in column name, only allowed [A-Za-z_]";
    } else {
      return value;
    }
  };
  const operatorCheck = function(obj) {
    const operator = obj.operator;
    let value = obj.value;
    const isAttribute = obj.valueType === "ATTRIBUTE";
    if (obj.attributeType === "date" && obj.valueType !== "ATTRIBUTE") {
      isDate = true;
      if (typeof value === "string" && value.toUpperCase() !== "NULL") {
        const date = new Date(obj.value);
        let day = date.getDate().toString();
        if (day.length === 1) {
          day = "0" + day;
        }
        let month = (date.getMonth() + 1).toString();
        if (month.length === 1) {
          month = "0" + month;
        }
        value = `to_date('${day}.${month}.${date.getFullYear()}', 'DD.MM.YYYY')`;
      }
    }
    if (obj.attributeType === "number") {
      isNumber = true;
    }
    if (obj.attributeType === "number" && obj.valueType !== "ATTRIBUTE" && value === "") {
      value = 0;
    }
    if (obj.attributeType === "dateTime") {
      if (typeof value === "string") {
        value = new Date(value);
      }
      isDateTime = true;
    }
    if (operator === "IS_BLANK") {
      const numberIs0 = ` or ${validateColumnName(obj.attribute)} = 0`;
      return `is null${isNumber ? numberIs0 : ""}`;
    }
    if (operator === "IS_NOT_BLANK") {
      const numberNot0 = ` and ${validateColumnName(obj.attribute)} != 0`;
      return `is not null${isNumber ? numberNot0 : ""}`;
    }
    if (operator === "EQUAL") {
      if (isDate) {
        if (isAttribute) {
          return `= ${validateColumnName(value)}`;
        } else {
          return `= ${value}`;
        }
      }
      if (isNumber) {
        if (isAttribute) {
          return `= ${validateColumnName(value)}`;
        } else {
          if (value !== 0) {
            return `= ${getBinding(value)}`;
          } else {
            return `= ${getBinding(value)} or ${validateColumnName(obj.attribute)} is null`;
          }
        }
      }
      return isAttribute ? `= upper(${validateColumnName(value)})` : `= upper(${getBinding(value)})`;
    }
    if (operator === "LESS_THAN_OR_EQUAL_TO") {
      if (isDate) {
        return isAttribute ? `<= ${validateColumnName(value)}` : `<= ${value}`;
      }
      if (isNumber) {
        return isAttribute ? `<= ${validateColumnName(value)}` : `<= ${getBinding(value)}`;
      }
      return isAttribute ? `<= upper(${validateColumnName(value)})` : `<= upper(${getBinding(value)})`;
    }
    if (operator === "GREATER_THAN_OR_EQUAL_TO") {
      if (isDateTime) {
        return `>= ${getBinding(value)}`;
      }
      if (isDate) {
        return isAttribute ? `>= ${validateColumnName(value)}` : `>= ${value}`;
      }
      if (isNumber) {
        return isAttribute ? `>= ${validateColumnName(value)}` : `>= ${getBinding(value)}`;
      }
      return isAttribute ? `>= upper(${validateColumnName(value)})` : `>= upper(${getBinding(value)})`;
    }
    if (operator === "LESS_THAN") {
      if (isDate) {
        return isAttribute ? `< ${validateColumnName(value)}` : `< ${value}`;
      }
      if (isNumber) {
        return isAttribute ? `< ${validateColumnName(value)}` : `< ${getBinding(value)}`;
      }
      return isAttribute ? `< upper(${validateColumnName(value)})` : `< upper(${getBinding(value)})`;
    }
    if (operator === "GREATER_THAN") {
      if (isDate) {
        return isAttribute ? `> ${validateColumnName(value)}` : `> ${value}`;
      }
      if (isNumber) {
        return isAttribute ? `> ${validateColumnName(value)}` : `> ${getBinding(value)}`;
      }
      return isAttribute ? `> upper(${validateColumnName(value)})` : `> upper(${getBinding(value)})`;
    }
    if (operator === "CONTAINS") {
      if (isDate) {
        return isAttribute ? `>= ${validateColumnName(value)}` : `>= ${value}`;
      }
      return isAttribute ? `like upper('%'||${validateColumnName(value)}||'%')` : `like upper(${getBinding("%" + value + "%")})`;
    }
    if (operator === "NOT_EQUAL_TO") {
      if (isDate) {
        if (isAttribute) {
          return `!= ${validateColumnName(value)}  or ${validateColumnName(obj.attribute)} is null`;
        }
        return `!= ${value} or ${validateColumnName(obj.attribute)} is null`;
      }
      if (isAttribute) {
        return `!= upper(${validateColumnName(value)})  or ${validateColumnName(obj.attribute)} is null`;
      }
      return `!= upper(${getBinding(value)}) or ${validateColumnName(obj.attribute)} is null`;
    }
    if (operator === "DOES_NOT_CONTAIN") {
      if (isDate) {
        return isAttribute ? `< ${validateColumnName(value)}` : `< ${value}`;
      }
      return isAttribute ? `not like upper('%'||${validateColumnName(value)}||'%') or ${validateColumnName(obj.attribute)} is null` : `not like upper(${getBinding("%" + value + "%")}) or ${validateColumnName(obj.attribute)} is null`;
    }
    if (operator === "BEGIN_WITH") {
      if (isDate) {
        return isAttribute ? `>= ${validateColumnName(value)}` : `>= ${value}`;
      }
      return isAttribute ? `like upper(${validateColumnName(value)}) || '%'` : `like upper(${getBinding(value + "%")})`;
    }
    if (operator === "END_WITH") {
      if (isDate) {
        return isAttribute ? `<= ${validateColumnName(value)}` : `<= ${value}`;
      }
      return isAttribute ? `like '%' || upper(${validateColumnName(value)})` : `like upper(${getBinding("%" + value)})`;
    }
    return "=";
  };
  const parser = function(obj, qs = "") {
    if (obj) {
      if (!obj.filterArguments || obj.filterArguments && obj.filterArguments.length === 0) {
        const columnName = validateColumnName(obj.attribute);
        if (obj.operator !== "IN" && obj.operator !== "NOT_IN") {
          if (obj.attributeType === "dateTime") {
            qs = qs + `${columnName} ${operatorCheck(obj)}`;
          } else {
            qs = qs + `upper(${columnName}) ${operatorCheck(obj)}`;
          }
        } else {
          let haveNULL = false;
          const columnName2 = validateColumnName(obj.attribute);
          const operator = obj.operator === "IN" ? "IN" : "NOT IN";
          let value;
          if (Array.isArray(obj.value)) {
            value = obj.value.map((val) => {
              if (!val || val === "NULL") {
                haveNULL = true;
              }
              if (obj.attributeType === "number") {
                return `(1, ${getBinding(NumberFormater.toNumber(val))})`;
              }
              if (obj.attributeType === "date") {
                return `(1, to_date(${getBinding(val)}, 'DD.MM.YYYY'))`;
              }
              return `(1, ${getBinding(val)})`;
            });
          } else {
            value = obj.value.split("\n").map((val) => {
              if (!val || val === "NULL") {
                haveNULL = true;
              }
              if (obj.attributeType === "number") {
                return `(1, ${getBinding(NumberFormater.toNumber(val))})`;
              }
              if (obj.attributeType === "date") {
                return `(1, to_date(${getBinding(val)}, 'DD.MM.YYYY'))`;
              }
              return `(1, ${getBinding(val)})`;
            });
          }
          qs = qs + `(1, upper(${columnName2})) ${operator} (${value})`;
          if (haveNULL) {
            if (obj.operator === "IN") {
              qs = qs + " or " + columnName2 + " is null)";
            } else {
              qs = qs + " and " + columnName2 + " is not null)";
            }
          } else {
            qs = qs + "";
          }
        }
      } else {
        obj.filterArguments.forEach((y, i) => {
          if (i > 0) {
            qs = qs + ` ${obj.logicalOperator === "AND" ? "AND" : "OR"} `;
          } else {
            qs = qs + `(`;
          }
          qs = parser(y, qs);
          if (obj.filterArguments.length - 1 === i) {
            qs = qs + `)`;
          }
        });
      }
    }
    return qs;
  };
  return {
    sqlString: parser(filter),
    sqlBindings: sqlBindings.length > 0 ? sqlBindings : null
  };
}

// src/utils/standardProjectQuery.ts
var STREAM_WRITE_TAG_END = "!END!";
var STREAM_WRITE_ARRAY_SPLIT = "!CHSP!";
async function standardProjectQuery(req, res, viewName, queryOverride) {
  var _a, _b;
  const { meta, rows, count, format } = req.query;
  log(CONSOLE_INFO, `request meta:`, meta);
  log(CONSOLE_INFO, `request rows:`, rows);
  log(CONSOLE_INFO, `request count:`, count);
  log(CONSOLE_INFO, `request json:`, format);
  function isJsonFormat(value) {
    if (typeof value === "string" && value.toUpperCase() === "JSON") {
      return true;
    } else {
      return false;
    }
  }
  const usejson = isJsonFormat(format);
  if (usejson) {
    res.setHeader("Content-Type", "application/json");
  } else {
    res.setHeader("Content-Type", "text/html");
  }
  let maxRows = parseInt(rows);
  if (isNaN(maxRows)) {
    maxRows = 0;
  }
  let jsonFilter = queryOverride || req.body;
  let whereSql, sqlBindings;
  if (jsonFilter) {
    if (!(jsonFilter == null ? void 0 : jsonFilter.filterArguments) && (jsonFilter == null ? void 0 : jsonFilter.attribute)) {
      jsonFilter = { filterArguments: [jsonFilter] };
    }
    const result = getSqlWhereString(jsonFilter);
    whereSql = result.sqlString;
    sqlBindings = result.sqlBindings;
  }
  let sql = "";
  if (viewName) {
    const whereQuery = whereSql ? `where ${whereSql}` : "";
    sql = `from ${viewName} ${whereQuery}`;
    switch (true) {
      case meta === "1":
        sql = `select * ${sql} ${whereSql ? " and 1 = 0" : " where 1 = 0"}`;
        break;
      case count === "1":
        sql = `select count(*) as count ${sql}`;
        break;
      case rows > 0:
        sql = `select * ${sql} fetch first ${maxRows} rows only`;
        break;
      default:
        sql = `select * ${sql}`;
    }
  } else {
    res.statusMessage = "api config is missing sqlSelect";
    res.status(504).send();
    res.end();
    return;
  }
  log(CONSOLE_SELECT, `--------------------------------------------------`);
  log(CONSOLE_SELECT, `standardProjectQuery:`);
  log(CONSOLE_SELECT, `--------------------------------------------------`);
  log(CONSOLE_SELECT, sql.split("\n").join("\n   Info:  "));
  logLine(CONSOLE_SELECT);
  let firstJson = true;
  await streamQuery(sql, sqlBindings, (_b = (_a = req.session) == null ? void 0 : _a.user) == null ? void 0 : _b.id, viewName, usejson ? true : false, function(data, done) {
    if (usejson) {
      if (firstJson && !done) {
        data = data.substring(0, data.length - 1);
        firstJson = false;
      } else {
        if (firstJson && done) {
          firstJson = false;
        } else {
          if (!done) {
            data = "," + data.substring(1, data.length - 1);
          } else {
            data = "," + data.substring(1, data.length);
          }
        }
      }
      res.write(data);
    } else {
      res.write(data + STREAM_WRITE_TAG_END + STREAM_WRITE_ARRAY_SPLIT);
    }
  }).catch((e) => {
    var _a2;
    res.statusMessage = ((_a2 = e.msg) == null ? void 0 : _a2.message) || e.msg;
    res.status(504).send();
    res.end();
    return;
  });
  res.end();
}

// src/utils/getSqlAccess.ts
var sqlUserRoles = /* @__PURE__ */ new Map();
async function getRoles(username) {
  if (sqlUserRoles.has(username)) {
    return sqlUserRoles.get(username) || [];
  } else {
    await updateSqlAccess(username);
    if (sqlUserRoles.has(username)) {
      return sqlUserRoles.get(username) || [];
    } else {
      return [];
    }
  }
}
async function updateSqlAccess(username) {
  const roles = [];
  await streamQuery(`select NAME from AI_WEB_USER_ROLE where username = :1`, [username], username, "AI_WEB_USER_ROLE", true, (data) => {
    if (Array.isArray(data)) {
      data.forEach((e) => {
        if (Array.isArray(e)) {
          roles.push(e[0]);
        } else {
          roles.push(e);
        }
      });
    }
  }, true);
  sqlUserRoles.set(username, roles);
}

// src/utils/protectedRoute.ts
async function protectedRoute(req, res, next) {
  var _a;
  let error = false;
  if (ACTIVATE_AZURE_FAKE_SUCCESS) {
    log(CONSOLE_INFO, "ACTIVATED FAKE USER", "ROLES GIVEN:", AZURE_FAKE_ROLES);
    req.session.user = {
      name: "FAKE USER",
      id: "FAKE USER ID",
      roles: AZURE_FAKE_ROLES,
      account: "BLABLA"
    };
  } else {
    log(CONSOLE_INFO, "protectedRoute called userSession:", (_a = req.session) == null ? void 0 : _a.name);
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: "not logged in", auth: false });
    error = true;
  } else {
    if (!ACTIVATE_AZURE_FAKE_SUCCESS) {
      try {
        await res.__msalClient.acquireTokenSilent(req, false);
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

// src/utils/generateApi.ts
var import_express2 = __toESM(require("express"));

// src/utils/generateProjectCUDSql.ts
function generateProjectCUDSql(whitelist, viewName, primaryKey, data) {
  const keys = Object.keys(data).filter((v) => whitelist.indexOf(v) !== -1);
  const havePrimaryKey = Object.keys(data).includes("PRIMARY_KEY_VAR");
  const isDelete = Object.keys(data).includes("__$delete");
  const isUpdate = Object.keys(data).includes("__$update");
  const isInsert = Object.keys(data).includes("__$insert");
  let sqlString = "";
  let type = null;
  if (keys.length === 0 && !isDelete) {
    sqlString = "";
  } else {
    switch (true) {
      case (isDelete && !isUpdate && !isInsert && havePrimaryKey):
        type = "delete" /* delete */;
        sqlString = `delete from 
	${viewName} 
where 
	${primaryKey} = :${"PRIMARY_KEY_VAR"}`;
        break;
      case (isUpdate && !isDelete && !isInsert && havePrimaryKey):
        type = "update" /* update */;
        sqlString = `update 
	${viewName} 
set`;
        keys.forEach((key, i) => {
          sqlString = sqlString + `${i > 0 ? "," : ""}
	${key} = :${key}`;
        });
        sqlString = sqlString + `
where 
	${primaryKey} = :${"PRIMARY_KEY_VAR"}
`;
        break;
      case (isInsert && !isDelete && !isUpdate):
        type = "insert" /* insert */;
        sqlString = `insert into ${viewName}(
	${keys.join(",\n	")}) 
values(${keys.map((v) => "\n	:" + v).join(",")})
returning 
	${primaryKey} into :${"RETURN_KEY"}
`;
    }
  }
  keys.forEach((key) => {
    if (typeof data[key] === "string" && data[key][10] === "T" && data[key][13] === ":" && data[key][23] === "Z" && data[key].length === 24) {
      data[key] = new Date(data[key]);
    }
  });
  return [sqlString, type];
}

// src/utils/standardProjectUpdate.ts
async function standardProjectUpdate(data, roles, tableConfig, databaseHandler, callback) {
  if (!data) {
    databaseHandler.error("missing data");
    return;
  }
  if (Array.isArray(data)) {
    data = data.sort((a, b) => {
      let A = 0;
      let B = 0;
      switch (true) {
        case a.__$delete === 1:
          A = 1;
          break;
        case a.__$update === 1:
          A = 2;
          break;
        case a.__$insert === 1:
          A = 3;
          break;
      }
      switch (true) {
        case b.__$delete === 1:
          B = 1;
          break;
        case b.__$update === 1:
          B = 2;
          break;
        case b.__$insert === 1:
          B = 3;
          break;
      }
      return A - B;
    });
  }
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const isDelete = Object.keys(row).includes("__$delete");
      if (isDelete && roles.DELETE !== true) {
        databaseHandler.error("missing delete access", `access denied, missing delete access`);
        return;
      }
      const isUpdate = Object.keys(row).includes("__$update");
      if (isUpdate && roles.UPDATE !== true) {
        databaseHandler.error("missing update access", `access denied, missing update access`);
        return;
      }
      const isInsert = Object.keys(row).includes("__$insert");
      if (isInsert && roles.INSERT !== true) {
        databaseHandler.error("missing insert access", `access denied, missing insert access`);
        return;
      }
      if (!isInsert && !isUpdate && !isDelete) {
        databaseHandler.error("not insert/update or delete", `access denied, not valid code`);
        return;
      }
    }
  }
  try {
    await databaseHandler.createDBConnection();
  } catch (err) {
    databaseHandler.rollbackAndCloseDB();
    databaseHandler.error("get connection failed");
    return;
  }
  try {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        let getReturnType = function(tc) {
          if (tc.primaryKeyType === "number") {
            return {
              type: 2010 /* NUMBER */,
              dir: 3003 /* BIND_OUT */
            };
          } else {
            return {
              type: 2001 /* STRING */,
              dir: 3003 /* BIND_OUT */
            };
          }
        };
        let row = data[i];
        const [sqlString, type] = generateProjectCUDSql(roles.UPDATABLE_COLUMNS || [], tableConfig.viewName, tableConfig.primaryKey, row);
        if (type !== "insert" && type !== "update" && type !== "delete") {
          throw new Error("request is not insert/update or delete, access denied");
        }
        const dataKeys = Object.keys(row);
        const allowedKeys = roles.UPDATABLE_COLUMNS.filter((e) => {
          if (dataKeys.includes(e)) {
            return true;
          }
          return false;
        });
        if (allowedKeys.length === 0) {
          if (type === "update") {
            throw new Error("not allowed to update without column data");
          }
        }
        allowedKeys.push("PRIMARY_KEY_VAR");
        const cleanData = {};
        allowedKeys.forEach((att) => {
          cleanData[att] = row[att];
        });
        row = cleanData;
        if (type === "insert") {
          delete row.PRIMARY_KEY_VAR;
        }
        if (sqlString) {
          if (type === "insert") {
            row["RETURN_KEY"] = getReturnType(tableConfig);
          }
          logLine(CONSOLE_SELECT);
          log(CONSOLE_SELECT, "Update/insert/delete sql:");
          log(CONSOLE_SELECT, "---------------------------------------");
          log(CONSOLE_SELECT, "SQL:");
          log(CONSOLE_SELECT, "---------------------------------------");
          log(CONSOLE_SELECT, "\n   Info:  " + sqlString.split("\n").join("\n   Info:  "));
          log(CONSOLE_SELECT, "---------------------------------------");
          log(CONSOLE_SELECT, "SQL_BINDINGS:");
          log(CONSOLE_SELECT, "---------------------------------------");
          log(CONSOLE_SELECT, row);
          logLine(CONSOLE_SELECT);
          await databaseHandler.execute(sqlString, row);
          callback(i);
        }
      }
      await databaseHandler.commitAndCloseDB();
    }
  } catch (err) {
    await databaseHandler.rollbackAndCloseDB();
    databaseHandler.error("save failed", err.message);
    return;
  }
  databaseHandler.done();
}

// src/utils/basicDataHandler.ts
var BasicDataHandler = class {
  constructor(res, viewApi, clientID) {
    this.newRecordKeys = [];
    this.skipConnection = false;
    this.res = res;
    this.viewApi = viewApi;
    this.clientID = clientID;
  }
  async createDBConnection() {
    if (this.skipConnection) {
      log(CONSOLE_INFO, "skipConnection activated, skipping getDbConnection");
    } else {
      this.dbConnection = await getDatabaseConnection(this.clientID);
    }
  }
  error(statusMessage, clientErrorMsg) {
    logError(statusMessage, clientErrorMsg);
    this.res.statusMessage = statusMessage;
    this.res.write(`${STREAM_WRITE_TAG_END}${JSON.stringify({ msg: clientErrorMsg || statusMessage || "" })}`);
    this.res.end();
  }
  async execute(sqlString, databindings) {
    if (this.skipConnection) {
      log(CONSOLE_INFO, "skipConnection activated, skipping execute");
    } else {
      if (this.dbConnection) {
        const x = await this.dbConnection.execute(sqlString, databindings, {
          resultSet: true
        });
        if (x == null ? void 0 : x.outBinds) {
          if (x.outBinds["RETURN_KEY"]) {
            const binds = x.outBinds["RETURN_KEY"];
            this.newRecordKeys.push(binds);
          }
        }
      } else {
        throw new Error("execute called without db connection");
      }
    }
  }
  async commitAndCloseDB() {
    if (this.skipConnection) {
      log(CONSOLE_INFO, "skipConnection activated, skipping commitAndCloseDB");
    } else {
      if (this.dbConnection) {
        await this.dbConnection.commit();
        await this.dbConnection.close();
      } else {
        throw new Error("commitAndCloseDB called without db connection");
      }
    }
  }
  async rollbackAndCloseDB() {
    if (this.skipConnection) {
      log(CONSOLE_INFO, "skipConnection activated, skipping rollbackAndCloseDB");
    } else {
      if (this.dbConnection) {
        await this.dbConnection.rollback();
        await this.dbConnection.close();
      } else {
        throw new Error("rollbackAndCloseDB called without db connection");
      }
    }
  }
  done() {
    this.res.write(`${STREAM_WRITE_TAG_END}${JSON.stringify(this.newRecordKeys.flat())}`);
    this.res.end();
  }
};

// src/utils/generateRoleObject.ts
function generateRoleObject(config, userRoles) {
  var _a, _b;
  function isObject(x) {
    return typeof x === "object" && !Array.isArray(x) && x !== null;
  }
  if (!config || !isObject(config) || !userRoles || !Array.isArray(userRoles)) {
    return {
      DELETE: false,
      INSERT: false,
      UPDATE: false,
      UPDATABLE_COLUMNS: []
    };
  }
  let insertAccess = false;
  (_a = config.accessInsert) == null ? void 0 : _a.forEach((role) => {
    if (!insertAccess && typeof role === "string") {
      if (userRoles.includes(role)) {
        insertAccess = true;
      }
    }
  });
  let deleteAccess = false;
  (_b = config.accessDelete) == null ? void 0 : _b.forEach((role) => {
    if (!deleteAccess && typeof role === "string") {
      if (userRoles.includes(role)) {
        deleteAccess = true;
      }
    }
  });
  const updatableColumns = [];
  if (Array.isArray(config.columns)) {
    config.columns.forEach((column) => {
      const updateAccessConfig = config.accessUpdate || [];
      const updateAccessCol = column.accessUpdate || [];
      const updateAccessFull = updateAccessConfig.concat(updateAccessCol);
      updateAccessFull.filter((role) => {
        if (typeof role === "string") {
          if (userRoles.includes(role)) {
            updatableColumns.push(column.name);
          }
        }
      });
    });
  }
  return {
    DELETE: deleteAccess,
    INSERT: insertAccess,
    UPDATE: updatableColumns.length > 0,
    UPDATABLE_COLUMNS: updatableColumns
  };
}

// src/utils/generateApi.ts
var initiatedDefaultApi = false;
var API = {};
function initiateDefaultConfig(app2) {
  {
    const API_INFO = `/api/auth`;
    logStartup("API added:", API_INFO);
    app2.get(API_INFO, protectedRoute, async function(req, res, next) {
      const sessionUser = req.session.user;
      const userName = sessionUser == null ? void 0 : sessionUser.name;
      const userID = sessionUser == null ? void 0 : sessionUser.id;
      const userAzureRoles = sessionUser == null ? void 0 : sessionUser.roles;
      const sqlProjectRoles = await getRoles(userID);
      res.status(200).send({
        azureRoles: userAzureRoles,
        allUserRoles: userAzureRoles.concat(sqlProjectRoles),
        user: { userName, userID }
      });
      res.end();
      next();
    });
  }
  {
    const API_INFO = `/api/authUpdate`;
    logStartup("API added:", API_INFO);
    app2.get(API_INFO, async function(req, res, next) {
      if (ACTIVATE_AZURE_FAKE_SUCCESS) {
        res.status(200);
        res.end();
      } else {
        try {
          await res.__msalClient.acquireTokenSilent(req, true);
          const sessionUser = req.session.user;
          const userID = sessionUser == null ? void 0 : sessionUser.id;
          const userName = sessionUser == null ? void 0 : sessionUser.name;
          const userAzureRoles = sessionUser == null ? void 0 : sessionUser.roles;
          await updateSqlAccess(sessionUser == null ? void 0 : sessionUser.id);
          const sqlProjectRoles = await getRoles(userID);
          res.status(200).send({
            azureRoles: userAzureRoles,
            allUserRoles: userAzureRoles.concat(sqlProjectRoles),
            user: { userName, userID }
          });
          res.end();
        } catch (x) {
          res.status(401).send({
            success: false,
            message: "not logged in, could not refresh token",
            auth: false
          });
        }
      }
      next();
    });
  }
  {
    const API_INFO = `/api/all`;
    logStartup("API added:", API_INFO);
    app2.get(API_INFO, protectedRoute, async function(req, res, next) {
      log(CONSOLE_INFO, "calling api:", API_INFO, req.path);
      const keyName = Object.keys(API);
      const paths = keyName.map((key) => {
        return {
          path: key
        };
      });
      const sessionUser = req.session.user;
      const userName = sessionUser == null ? void 0 : sessionUser.name;
      const userID = sessionUser == null ? void 0 : sessionUser.id;
      const userAzureRoles = sessionUser == null ? void 0 : sessionUser.roles;
      const sqlProjectRoles = await getRoles(userID);
      res.status(200).send({
        paths,
        azureRoles: userAzureRoles,
        allUserRoles: userAzureRoles.concat(sqlProjectRoles),
        user: { userName, userID }
      });
      res.end();
      next();
    });
  }
  {
    const API_INFO = `/api/info/*`;
    logStartup("API added:", API_INFO);
    app2.get(API_INFO, protectedRoute, import_express2.default.json(), async function(req, res, next) {
      log(CONSOLE_INFO, "calling api:", API_INFO, req.path);
      const name = req.path.replace(API_INFO.replace("*", ""), "");
      const api = API[name];
      if (!api) {
        const statusMessage = "unknown API";
        res.statusMessage = statusMessage;
        res.status(500).send({ msg: statusMessage });
        res.end();
        return;
      }
      const sessionUser = req.session.user;
      const userName = sessionUser == null ? void 0 : sessionUser.name;
      const userID = sessionUser == null ? void 0 : sessionUser.id;
      const sqlProjectRoles = await getRoles(userID);
      const userroles = generateRoleObject(api, sqlProjectRoles);
      res.status(200).send({
        api,
        apiRoles: userroles,
        allUserRoles: sqlProjectRoles,
        user: { userName, userID }
      });
      res.end();
      next();
    });
  }
  {
    const API_QUERY = `/api/query/*`;
    logStartup("API added:", API_QUERY);
    app2.post(API_QUERY, protectedRoute, import_express2.default.json(), async function(req, res, next) {
      log(CONSOLE_INFO, "calling api:", API_QUERY);
      const name = req.path.replace(API_QUERY.replace("*", ""), "");
      const api = API[name];
      if (!api) {
        const statusMessage = "unknown API";
        res.statusMessage = statusMessage;
        res.status(500).send({ msg: statusMessage });
        res.end();
        return;
      }
      await standardProjectQuery(req, res, name);
      next();
    });
  }
  {
    const API_UPDATE = `/api/update/*`;
    logStartup("API added:", API_UPDATE);
    app2.post(API_UPDATE, protectedRoute, import_express2.default.json(), async function(req, res, next) {
      log(CONSOLE_INFO, "calling api:", API_UPDATE);
      const name = req.path.replace(API_UPDATE.replace("*", ""), "");
      const api = API[name];
      if (!api) {
        const statusMessage = "unknown API";
        res.statusMessage = statusMessage;
        res.status(500).send({ msg: statusMessage });
        res.end();
        return;
      }
      const sessionUser = req.session.user;
      const userID = sessionUser == null ? void 0 : sessionUser.id;
      const sqlProjectRoles = await getRoles(userID);
      const userroles = generateRoleObject(api, sqlProjectRoles);
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-cache");
      await standardProjectUpdate(req.body, userroles, api, new BasicDataHandler(res, api, userID), (count) => {
        res.write(`${STREAM_WRITE_ARRAY_SPLIT}${count}`);
      });
      next();
    });
  }
}
function generateApi(app2, api) {
  API[api.viewName] = api;
  if (!initiatedDefaultApi) {
    initiateDefaultConfig(app2);
    initiatedDefaultApi = true;
  }
}

// src/utils/readApiConfig.ts
function readApiConfig(aniConfig) {
  const apis = aniConfig;
  const errors = [];
  return { apis, errors };
}

// src/default_api_config/aiWebRestApi.ts
var aiWebRestApi = {
  viewName: "AI_WEB_REST_API",
  accessUpdate: ["API_ADMIN"],
  primaryKey: "ID",
  primaryKeyType: "number",
  columns: [
    {
      name: "NAME"
    },
    {
      name: "DATA"
    },
    {
      name: "ENABLED"
    }
  ]
};

// src/default_api_config/aiWebRoleApi.ts
var aiWebRoleApi = {
  viewName: "AI_WEB_ROLE",
  accessUpdate: ["ACCESS_ADMIN"],
  primaryKey: "ID",
  primaryKeyType: "number",
  columns: [
    {
      name: "NAME"
    },
    {
      name: "DESCRIPTION"
    }
  ]
};

// src/default_api_config/aiWebUserApi.ts
var aiWebUserApi = {
  viewName: "AI_WEB_USER",
  accessUpdate: ["ACCESS_ADMIN"],
  primaryKey: "ID",
  primaryKeyType: "number",
  columns: [
    {
      name: "USERNAME"
    },
    {
      name: "FIRSTNAME"
    },
    {
      name: "LASTNAME"
    }
  ]
};

// src/default_api_config/aiWebUserRoleApi.ts
var aiWebUserRoleApi = {
  viewName: "AI_WEB_USER_ROLE",
  accessUpdate: ["ACCESS_ADMIN"],
  primaryKey: "ID",
  primaryKeyType: "number",
  columns: [
    {
      name: "WEB_USER_ID"
    },
    {
      name: "WEB_ROLE_ID"
    }
  ]
};

// src/utils/getDefaultConfig.ts
function getDefaultConfig() {
  return [aiWebRestApi, aiWebRoleApi, aiWebUserApi, aiWebUserRoleApi];
}

// src/index.ts
async function start() {
  await initOracleDatabaseConnection();
  try {
    await streamQuery(`select username from AI_WEB_USER fetch first 1 rows only`, [], "na", "AI_WEB_USER", true, (data) => {
      logStartup("ORACLE ACCESS DB TEST: ", data);
    }, true);
  } catch (e) {
    logError("ORACLE ACCESS DB ERROR: default tables need to have be added");
    logError("ORACLE ACCESS DB ERROR:", e);
    process.exit(1);
  }
  await initHttpConfig();
  startHttpServer();
  const { apis, errors } = readApiConfig(getDefaultConfig());
  if (errors.length) {
    errors.forEach((err) => {
      logError(err.apiname, " fails checks, service will be forced to quit, fix error before you try again");
    });
    process.exit(1);
  }
  apis.forEach((api) => {
    generateApi(app, api);
    logStartup("API added :", api.viewName);
  });
  logLine(true);
}
start();
//# sourceMappingURL=index.js.map
