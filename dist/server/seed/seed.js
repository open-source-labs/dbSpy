"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
// // Connect to SQL db and create users table
if (!process.env.USER_DB_URL) {
    console.info('We are in the first error');
    throw new Error('USER_DB_URL not found');
}
const connection = mysql2_1.default.createConnection(process.env.USER_DB_URL);
// const loadData = () => {
//   console.info('we are in loadData')
//   console.log(process.env.USER_DB_URL);
//   const createUserTable: string =
//   `CREATE TABLE
// 	'Users' (
//       'id' int NOT NULL AUTO_INCREMENT,
//       'full_name' varchar(240) NOT NULL,
//       'sub' varchar(40) DEFAULT NULL,
//       'email' varchar(240) NOT NULL,
//       'picture' varchar(240) DEFAULT NULL,
//       'pg_schema' text,
//       'password' varchar(240) NOT NULL,
//       PRIMARY KEY (id)
//     ) ENGINE = InnoDB AUTO_INCREMENT = 40 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`;
//   try {
//     connection.query(createUserTable);
//   } catch (err) {
//     log.info(err);
//   }
// };
// loadData();
const MysqlDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "process.env.USER_DB_URL",
    port: 3306,
    username: "admin",
    password: "Codesmith",
    database: "dbSpy",
    entities: [
        user_entity_1.User
    ],
});
process.exit(0);
//# sourceMappingURL=seed.js.map