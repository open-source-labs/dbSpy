import mysql from 'mysql2';
import fs from 'fs';
import log from '../logger';
import path from 'path';

const dotenv = require('dotenv');
dotenv.config();

const { USER_DB_URL_MYSQL, USER_DB_USER_MYSQL, USER_DB_PW_MYSQL, DB_PORT } = process.env;

// SSL data stored as environment variable for GitHub Actions access
// Also stored in .cert file because Elastic Beanstalk has a ~4000 char limit for its environment variables
// const SSL_KEY =
//   typeof process.env.SSL_KEY === 'string'
//     ? Buffer.from(process.env.SSL_KEY, 'base64').toString('ascii')
//     : fs.readFileSync('./.cert/key.pem').toString();
// const SSL_CERT =
//   typeof process.env.SSL_CERT === 'string'
//     ? Buffer.from(process.env.SSL_CERT, 'base64').toString('ascii')
//     : fs.readFileSync('./.cert/cert.pem').toString();

// Load CA certificate
// This will check if the env is dev
// If it is then we will read from ../certs/ca.pem
// Otherwise the env will be prod, and we are ignoring this since we have uploaded ca.pem to a S3 bucket, and .extensions/certs.config will be grabbing it from there and making a dir to store the cert
let ssl: any = false;
if (process.env.NODE_ENV === 'development') {
  const caCertPath = path.resolve(__dirname, '../certs/ca.pem'); // Make sure this file exists
  const caCert = fs.readFileSync(caCertPath, 'utf-8');
  ssl = {
    rejectUnauthorized: true,
    ca: caCert, // ✅ Provide Aiven's CA certificate
  };
}

const pool = mysql
  .createPool({
    host: USER_DB_URL_MYSQL,
    user: USER_DB_USER_MYSQL,
    password: USER_DB_PW_MYSQL,
    port: Number(DB_PORT),
    database: 'dbspy',
    waitForConnections: true,
    connectTimeout: 10000, // Timeout for establishing a connection
    connectionLimit: 10,
    queueLimit: 0,
    ssl,
    // ssl: {
    //   key: SSL_KEY,
    //   cert: SSL_CERT,
    // },
  })
  .promise(); // wrap with promise API

// Test Connection
pool
  .getConnection()
  .then((connection) => {
    log.info(`✅ MySQL pool connection established`);
    connection.release();
  })
  .catch((err) => {
    log.error(`❌ MySQL connection error:`, err);
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
