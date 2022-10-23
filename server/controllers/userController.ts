// import { connection } from "../models/dbSpyModel";
// import { pool, rows } from 'mssql';
import log from '../logger/index';
// import { connect } from '../utils/connect'
// import { RequestHandler } from 'express';
// // import { connect } from "http2";
// // import { emitWarning } from "process"
import mysql from 'mysql2';
import dotenv from 'dotenv';
// import { connect } from 'http2';
dotenv.config();

// interface UserInfo {
//     sub: string[],
//     name: string[],
//     email: string[],
//     picture: string[],
// }


// // type AwaitedReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
// // connection.query(create)

// interface Response {
//     locals: any
// }

// interface User {
//     createUser: RequestHandler
//     findUser: RequestHandler
//     // handleUser: RequestHandler
// }

// export const user: User = {
//     createUser: async (req, res, next) => {
//         // create a user
//         const queryStr = 'INSERT INTO users (sub, full_name, email, picture) VALUES (?, ?, ?, ?)';
//         const values = Object.values(res.locals.userInfo);
//         connection.query(queryStr, values);
//         return next();
//     },
//     findUser: async (req, res, next) => {
//         const queryStr = 'SELECT * FROM users WHERE sub = ?'
//         const values = [res.locals.userInfo.id]
//         connection.query(queryStr, values, (err, results) => {
//             if (err) return next({
//                 log: 'findUser ERROR: could not execute query',
//                 status: 500,
//             })
//             if (Array.isArray(results) && results.length) {
//                 // console.log('here is results', results, 'at 0', results[0], 'at 1', results[1])
//                 // console.log(res.header)
//                 // res.send(results[0])
//                 res.locals.foundUser = results[0];
//             }
//             return next();
//         })
//     }
// }

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

export const createUser = (user: string[]) => {
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
