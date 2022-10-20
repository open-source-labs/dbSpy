const createSQL = require('./sql.ts')
import mysql from 'mysql2';
import { env } from 'node:process';

// create the connection to db
const connection =  mysql.createConnection(env.DATABASE_URL?? '');

// create tables
const loadData = async () => {
    try {
        if (connection) await (await connection).query(createSQL.users);
        
    } catch(err) {
        console.log(err);
    }
}

async () => await loadData();

connection.end();

process.exit(0);

export {}