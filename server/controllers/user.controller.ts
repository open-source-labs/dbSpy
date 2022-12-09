import { RequestHandler } from "express"
import log from '../logger/index';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
const saltRounds = 10;
import dotenv from 'dotenv';
dotenv.config();

export const findUser = async (email: string, password?: string) => {
  console.log('user.controller: Firing findUser')
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
  const values = user;
  connection.query(queryStr, values, (err, rows) => {
    if (err) {
      log.info(err.message)
      throw new Error('Error on createUser: Could not create new user on DB.')
    }
    log.info('createUser: successfully created User')
  })
}

export const userRegistration: RequestHandler = async (req, res, next) => {
  console.log('firing user registration', req.body);
  const connection = mysql.createConnection(process.env.DATABASE_URL!);
  const foundUser = await findUser(req.body.email)
  if (!foundUser) {
    const { full_name, email, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hashedPW) => {
      if (err) return next(err)
      const queryStr = 'INSERT IGNORE INTO users (full_name, email, password) VALUES (?, ?, ?)';
      const values = [full_name, email, hashedPW];
      connection.query(queryStr, values, (err, data) => {
        if (err) {
          console.log('Error during user registration');
          return next(err);
        } else {
          console.log(`${email} succesfully registered!`);
          console.log('Data response,', data);
          return res.redirect(200, `/`);
        }
      })
    })
  }
  else return res.status(403).json({ err: 'Email already in use' });
}

export const verifyUser: RequestHandler = async (req, res, next) => {
  console.log('verify user fired')
  const foundUser = await findUser(req.body.email) as Array<{ password: string }>;
  if (foundUser) {
    const hashedPW = foundUser[0].password
    if (hashedPW === null) {
      log.info('Email Address exists inside OAuth');
      return res.redirect(403, '/login');
    }
    console.log(hashedPW)
    console.log(req.body.password)
    bcrypt.compare(req.body.password, hashedPW)
      .then(match => {
        if (!match) {
          log.info('Incorrect password')
          return res.redirect(403, '/login');
        }
        else {
          log.info('Username/Password confirmed');
          res.locals.user = foundUser[0];
          return res.status(200).json(res.locals.user);
        }
      })
  } else {
    return res.status(403).json({ err: 'Email address not found' })
  }
}

// Save currentSchema into database
export const saveSchema: RequestHandler = async (req, res, next) => {
  console.log('Firing saveSchema')
  const connection = mysql.createConnection(process.env.DATABASE_URL!);
  console.log(req.body.schema)
  const updateColQuery = `UPDATE users SET pg_schema = '${req.body.schema}' WHERE email = '${req.body.email}';`
  connection.query(updateColQuery, (err, data) => {
    if (err) return next(err)
    console.log(req.body.email + ' schema saved');
    log.info('Updated', data);
    return res.status(200)
  })
}

// Retrive saved schema
export const retrieveSchema: RequestHandler = async (req, res, next) => {
  console.log('Retrieve schema fired');
  const connection = mysql.createConnection(process.env.DATABASE_URL!);
  const updateColQuery = `SELECT pg_schema FROM users WHERE email = '${req.params.email}';`
  connection.query(updateColQuery, (err, data) => {
    if (err) return next(err)
    console.log(req.body.email + ' schema retrieved');
    const schema = data as Array<{pg_schema: string}>;
    console.log('Schema', schema[0].pg_schema);
    return res.status(200).json(schema[0].pg_schema)
  })
}

export const tableManipulation = async () => {
  const connection = mysql.createConnection(process.env.DATABASE_URL!);
  const queryStr = `SELECT * FROM users;`;
  const addQueryStr = `ALTER TABLE users ADD COLUMN pg_schema varchar(5000);`
  return new Promise((resolve, reject) => {
    connection.query(queryStr, (err, rows) => {
      if (err) return reject(err)
      console.log(rows)
    })
  })
}

