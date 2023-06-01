"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieSession = void 0;
const oauth_controller_1 = require("../controllers/oauth.controller");
const user_controller_1 = require("../controllers/user.controller");
const postgres_router_1 = require("./postgres.router");
const microsoft_router_1 = require("./microsoft.router");
const oracle_router_1 = require("./oracle.router");
const mysql_router_1 = require("./mysql.router");
const sqlite_router_1 = require("./sqlite.router");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const session_service_1 = require("../service/session.service");
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../logger/index"));
const routes = async (app) => {
    app.get('/api/healthcheck', (_req, res) => res.sendStatus(200));
    app.post('/api/oauth', oauth_controller_1.getGoogleAccesToken, oauth_controller_1.getUserInfo, user_controller_1.verifyUser);
    app.use('/api/sql/postgres', exports.cookieSession, postgres_router_1.postgresRouter);
    app.use('/api/sql/mysql', exports.cookieSession, mysql_router_1.mysqlRouter);
    app.use('/api/sql/mssql', exports.cookieSession, microsoft_router_1.microsoftRouter);
    app.use('/api/sql/oracle', exports.cookieSession, oracle_router_1.oracleRouter);
    app.use('/api/sql/sqlite', exports.cookieSession, sqlite_router_1.sqliteRouter);
    app.post('/api/saveSchema', user_controller_1.saveSchema);
    app.get('/api/retrieveSchema/:email', user_controller_1.retrieveSchema);
    app.post('/api/userRegistration', user_controller_1.userRegistration);
    app.post('/api/verifyUser', user_controller_1.verifyUser);
    app.use('/api/me', session_service_1.getCurrentUser);
    app.use('/api/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err)
                index_1.default.info('Error destroying session:', err);
            else {
                index_1.default.info('Successfully destroyed session');
                return res.redirect(`/`);
            }
        });
    });
    app.get('/*', (_req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../dist/index.html'));
    });
    // Global Error Handler
    app.use((err, _req, res, _next) => {
        const defaultErr = {
            log: 'Express error handler caught unknown middleware error',
            status: 500,
            message: 'An error occurred. This is the global error handler.',
        };
        const errorObj = Object.assign({}, defaultErr, err);
        index_1.default.error(errorObj.message);
        index_1.default.error(errorObj.log);
        console.log(err);
        return res.status(errorObj.status).json(errorObj.message);
    });
};
const cookieSession = (req, _res, next) => {
    //app.get('/', (_req: Request, _res: Response, next: NextFunction) => {
    const { db_type, hostname, password, port, username, database_name, service_name } = req.query;
    try {
        if (typeof db_type === 'string') {
            req.session.db_type = db_type;
        }
        if (typeof hostname === 'string') {
            req.session.hostname = hostname;
        }
        if (typeof password === 'string') {
            req.session.password = password;
        }
        if (typeof port === 'string') {
            req.session.port = port;
        }
        if (typeof username === 'string') {
            req.session.username = username;
        }
        if (typeof database_name === 'string') {
            req.session.database_name = database_name;
        }
        if (typeof service_name === 'string') {
            req.session.service_name = service_name;
        }
        console.log('Cookie has been set and is saving session data');
        console.log('req.session: ', req.session);
    }
    catch (err) {
        console.log('error was found in cookeSession: ', err);
        return next(err);
    }
    // })
    return next();
};
exports.cookieSession = cookieSession;
exports.default = routes;
//# sourceMappingURL=index.js.map