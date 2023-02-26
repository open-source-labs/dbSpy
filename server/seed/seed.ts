import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import log from '../logger/index';

// Connect to SQL db and create users table
if (!process.env.USER_DB_URL) throw new Error('USER_DB_URL not found');
const connection = mysql.createConnection(process.env.USER_DB_URL);

const loadData = () => {
  const createUserTable = `CREATE TABLE
    'users' (
      'id' int NOT NULL AUTO_INCREMENT,
      'full_name' varchar(240) NOT NULL,
      'sub' varchar(40) DEFAULT NULL,
      'email' varchar(240) NOT NULL,
      'picture' varchar(240) DEFAULT NULL,
      'pg_schema' text,
      'password' varchar(240) NOT NULL,
      PRIMARY KEY ('id')
    ) ENGINE = InnoDB AUTO_INCREMENT = 40 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`;
  try {
    connection.query(createUserTable);
  } catch (err) {
    log.info(err);
  }
};

loadData();

process.exit(0);
