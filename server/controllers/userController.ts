import { connection } from "../models/dbSpyModel";
import { RequestHandler } from 'express';
import { connect } from "http2";
import { emitWarning } from "process";


// type AwaitedReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
// connection.query(create)

interface Response {
    locals: any
}

interface User {
    createUser: RequestHandler
    findUser: RequestHandler
    // handleUser: RequestHandler
}

export const user: User = {
    createUser: async (req, res, next) => {
        // create a user
        const queryStr = 'INSERT INTO users (sub, full_name, email, picture) VALUES (?, ?, ?, ?)';
        const values = Object.values(res.locals.userInfo);
        connection.query(queryStr, values);
        return next();
    },
    findUser: async (req, res, next) => {
        const queryStr = 'SELECT * FROM users WHERE sub = ?'
        const values = [res.locals.userInfo.id]
        connection.query(queryStr, values, (err, results) => {
            if (err) return next({
                log: 'findUser ERROR: could not execute query',
                status: 500,
            })
            if (Array.isArray(results) && results.length) {
                // console.log('here is results', results, 'at 0', results[0], 'at 1', results[1])
                // console.log(res.header)
                // res.send(results[0])
                res.locals.foundUser = results[0];
            }
            return next();
        })
    }
}