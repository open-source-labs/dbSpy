import mysql from 'mysql2';
import fs from 'fs';
import log from '../logger';

const dotenv = require('dotenv');
dotenv.config();

const { USER_DB_USER, USER_DB_PW } = process.env;

// SSL data stored as environment variable for GitHub Actions access
// Also stored in .cert file because Elastic Beanstalk has a ~4000 char limit for its environment variables
const SSL_KEY =
  typeof process.env.SSL_KEY === 'string'
    ? Buffer.from(process.env.SSL_KEY, 'base64').toString('ascii')
    : fs.readFileSync('./.cert/key.pem').toString();
const SSL_CERT =
  typeof process.env.SSL_CERT === 'string'
    ? Buffer.from(process.env.SSL_CERT, 'base64').toString('ascii')
    : fs.readFileSync('./.cert/cert.pem').toString();

const pool = mysql
  .createPool({
    connectionLimit: 10,
    host: 'us-west.connect.psdb.cloud',
    user: USER_DB_USER,
    password: USER_DB_PW,
    database: 'dbspy_4',
    ssl: {
      key: SSL_KEY,
      cert: SSL_CERT,
    },
  })
  .promise(); // wrap with promise API
//connect used to be a var in the function below but it didn't do anything -Stephen
pool.on('connection', () => {
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
