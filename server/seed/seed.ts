const createUserTableSQL = require('./sql.ts')
const mysql = require('mysql2');
require('dotenv').config();


// create the connection to db
const connection =  mysql.createConnection(process.env.DATABASE_URL);

// create tables
const loadData = async () => {
    try {
        if (connection) await (await connection).query(createUserTableSQL);
        
    } catch(err) {
        console.log(err);
    }
}

async () => await loadData();
process.exit(0);