const createSQL = require('./sql.ts')
import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()
// create the connection to db

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not found');

const connection =  mysql.createConnection(process.env.DATABASE_URL);

// create tables
const loadData = () => {
    try {
        connection.query(createSQL.users);
        
    } catch(err) {
        console.log(err);
    }
}

loadData();

connection.end();

process.exit(0);

