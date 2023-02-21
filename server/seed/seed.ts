import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()
import log from '../logger/index'

// Connect to SQL db and create users table
if (!process.env.USER_DB_URL) throw new Error('USER_DB_URL not found');
const connection = mysql.createConnection(process.env.USER_DB_URL);

const loadData = () => {
    const createUserTable = `
        CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id),
        full_name VARCHAR(240),
        sub VARCHAR(40),
        email VARCHAR(240),
        picture VARCHAR(240),
        pg_schema TEXT
        )`;
    try { connection.query(createUserTable) } 
    catch (err) { log.info(err) }
}

loadData();

process.exit(0);