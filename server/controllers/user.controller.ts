import log from '../logger/index';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const findUser = async (email: string) => {
    const connection = mysql.createConnection(process.env.DATABASE_URL!);
    const queryStr = 'SELECT * FROM users WHERE email = ?'
    return new Promise((resolve, reject) => {
        connection.query(queryStr, [email], (err, rows) => {
            if (err) return reject(err)
            if (Array.isArray(rows) && rows.length === 0) return resolve(false);
            else return resolve(rows)
        })
    })
}

export const createUser = async (user: string[]) => {
    const connection = mysql.createConnection(process.env.DATABASE_URL!);

    const queryStr = 'INSERT IGNORE INTO users (sub, full_name, email, picture) VALUES (?, ?, ?, ?)';
    const values = user
    connection.query(queryStr, values, (err, rows) => {
        if (err) {
            log.info(err.message)
            throw new Error('Error on createUser: Could not create new user on DB.')
        }
        log.info('createUser: successfully created User')
    })
}
