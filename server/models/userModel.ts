import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';
import log from '../logger';

dotenv.config();

const { USER_DB_USER, USER_DB_PW } = process.env;

const pool = mysql
  .createPool({
    connectionLimit: 10,
    host: 'us-west.connect.psdb.cloud',
    user: USER_DB_USER,
    password: USER_DB_PW,
    database: 'dbspy_4',
    ssl: {
      key: Buffer.from(process.env.SSL_KEY as string, 'base64').toString('ascii'),
      cert: Buffer.from(process.env.SSL_CERT as string, 'base64').toString('ascii'),
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
