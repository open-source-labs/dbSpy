import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.USER_DB_URL_POSTGRES,
    port: 5432,
    username: process.env.USER_DB_USER_POSTGRES,
    password: process.env.USER_DB_PW_POSTGRES,
    database: 'xvcmlhle',
    synchronize: true,
    logging: true,
  });

  export const MysqlDataSource = new DataSource({
    type: "mysql",
    host: process.env.USER_DB_URL_MYSQL,
    port: 3306,
    username: process.env.USER_DB_USER_MYSQL,
    password: process.env.USER_DB_PW_MYSQL,
    database: 'dbSpy',
    synchronize: true,
    logging: true,
  });