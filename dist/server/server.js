"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./logger/index"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// import { DataSource } from 'typeorm';
// import { User, UserPost } from './entities/user.entity'
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
//----------------------------------------------------------------------------
// export const MysqlDataSource = new DataSource({
//     type: "mysql",
//     host: process.env.USER_DB_URL_MYSQL,
//     port: 3306,
//     username: process.env.USER_DB_USER_MYSQL,
//     password: process.env.USER_DB_PW_MYSQL,
//     database: 'dbSpy',
//     entities: [ User ],
// });
// const mysqlQuery = async () => {
//     try {
//       await MysqlDataSource.initialize();
//       console.log('Data Source has been initialized');
//       const userInfo = MysqlDataSource.getRepository(User)
//       const users = await userInfo.find();
//       console.log('users: ', users);
//     } catch (err) {
//       console.log('Error during Data Source: ', err);
//     }
//   }
//   //mysqlQuery();
//   export const PostgresDataSource = new DataSource({
//     type: "postgres",
//     host: process.env.USER_DB_URL_POSTGRES,
//     port: 5432,
//     username: process.env.USER_DB_USER_POSTGRES,
//     password: process.env.USER_DB_PW_POSTGRES,
//     synchronize: true,
//     logging: true,
//     entities: [ UserPost ],
// });
// const postgresQuery = async () => {
//     try {
//         await PostgresDataSource.initialize();
//         console.log('Data Source has been initialized');
//         const userInfo = PostgresDataSource.getRepository(UserPost);
//         console.log('userInfo.target: ', userInfo);
//         const tables = await userInfo.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
//         console.log('tables: ', tables);
//         for (const table of tables) {
//           const tableName = table.tablename;
//           const data = await userInfo.query(`SELECT * FROM ${tableName}`);
//           console.log(`Data from ${tableName}:`, data);
//         }
//     } catch (err) {
//       console.log('Error during Data Source: ', err);
//     }
//   }
// //   postgresQuery();
//----------------------------------------------------------------------------
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
app.listen(3000, () => {
    index_1.default.info(`Securely Running at ${port}`);
    (0, routes_1.default)(app);
});
exports.default = app;
//# sourceMappingURL=server.js.map