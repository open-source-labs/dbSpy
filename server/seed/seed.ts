const createSQL = require('./sql.ts')
const mysql = require('mysql2');
require('dotenv').config();

// create the connection to db
const connection =  mysql.createConnection(process.env.DATABASE_URL);

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