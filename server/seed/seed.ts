import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import log from '../logger/index';
import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
// // Connect to SQL db and create users table
if (!process.env.USER_DB_URL) {
  console.info('We are in the first error')
  throw new Error('USER_DB_URL not found');}
const connection = mysql.createConnection(process.env.USER_DB_URL);

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



const MysqlDataSource = new DataSource({
  type: "mysql",
  host: "process.env.USER_DB_URL",
  port: 3306,
  username: "admin",
  password: "Codesmith",
  database: "dbSpy",
  entities: [
      User
  ],
})

process.exit(0);
