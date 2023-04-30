"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const user_controller_1 = require("../controllers/user.controller");
const postgres_router_1 = require("./postgres.router");
const mysql_router_1 = __importDefault(require("./mysql.router"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const session_service_1 = require("../service/session.service");
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../logger/index"));
// import { DataSource } from 'typeorm'
// import { Users } from '../entities/user.entity'
const app = (0, express_1.default)();
app.use('/api/sql/postgres', postgres_router_1.postgresRouter);
const routes = async (app) => {
    app.get('/api/healthcheck', (_req, res) => res.sendStatus(200));
    app.get('/api/oauth/google', auth_controller_1.handleGoogleAuth);
    app.get('/api/googleAuthUrl', auth_controller_1.getGoogleAuthUrl);
    app.use('/api/sql/postgres', postgres_router_1.postgresRouter);
    app.use('/api/sql/mysql', mysql_router_1.default);
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
        return res.status(errorObj.status).json(errorObj.message);
    });
};
exports.default = routes;
//# sourceMappingURL=index.js.map