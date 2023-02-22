import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';
import log from '../logger';

dotenv.config();

const { USER_DB_HOST, USER_DB_USER, USER_DB_PW, USER_DB_NAME } = process.env;

const pool = mysql
  .createPool({
    connectionLimit: 10,
    host: USER_DB_HOST,
    user: USER_DB_USER,
    password: USER_DB_PW,
    database: USER_DB_NAME,
    ssl: {
      key: fs.readFileSync('./.cert/key.pem').toString(),
      cert: fs.readFileSync('./.cert/cert.pem').toString(),
    },
  })
  .promise(); // wrap with promise API

pool.on('connection', (connection) => {
  log.info(`MySQL pool connection established`);
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

export default pool;