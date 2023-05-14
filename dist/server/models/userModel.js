"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("../logger"));
const dotenv = require('dotenv');
dotenv.config();
const { USER_DB_URL_MYSQL, USER_DB_USER_MYSQL, USER_DB_PW_MYSQL } = process.env;
// SSL data stored as environment variable for GitHub Actions access
// Also stored in .cert file because Elastic Beanstalk has a ~4000 char limit for its environment variables
const SSL_KEY = typeof process.env.SSL_KEY === 'string'
    ? Buffer.from(process.env.SSL_KEY, 'base64').toString('ascii')
    : fs_1.default.readFileSync('./.cert/key.pem').toString();
const SSL_CERT = typeof process.env.SSL_CERT === 'string'
    ? Buffer.from(process.env.SSL_CERT, 'base64').toString('ascii')
    : fs_1.default.readFileSync('./.cert/cert.pem').toString();
const pool = mysql2_1.default
    .createPool({
    connectionLimit: 10,
    host: USER_DB_URL_MYSQL,
    user: USER_DB_USER_MYSQL,
    password: USER_DB_PW_MYSQL,
    database: 'user',
    // ssl: {
    //   key: SSL_KEY,
    //   cert: SSL_CERT,
    // },
})
    .promise(); // wrap with promise API
//connect used to be a var in the function below but it didn't do anything -Stephen
pool.on('connection', () => {
    logger_1.default.info(`MySQL pool connection established`);
});
/**
 * User Database Schema
 * --------------------
 * id int auto_increment PRIMARY KEY
 * full_name varchar(240) NOT NULL
 * sub varchar(40)
 * email varchar(240) NOT NULL
 * picture varchar(240)
 * pg_schema text
 * password varchar(240) NOT NULL
 */
exports.default = pool;
//# sourceMappingURL=userModel.js.map