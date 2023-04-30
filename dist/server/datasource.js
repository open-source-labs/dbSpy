"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlDataSource = exports.PostgresDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PostgresDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.USER_DB_URL_POSTGRES,
    port: 5432,
    username: process.env.USER_DB_USER_POSTGRES,
    password: process.env.USER_DB_PW_POSTGRES,
    database: 'xvcmlhle',
    synchronize: true,
    logging: true,
});
exports.MysqlDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.USER_DB_URL_MYSQL,
    port: 3306,
    username: process.env.USER_DB_USER_MYSQL,
    password: process.env.USER_DB_PW_MYSQL,
    database: 'dbSpy',
    synchronize: true,
    logging: true,
});
//# sourceMappingURL=datasource.js.map