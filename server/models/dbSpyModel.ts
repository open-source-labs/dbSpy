import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()
// create the connection to db
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not found');

const connection = mysql.createConnection(process.env.DATABASE_URL);

export { connection }

