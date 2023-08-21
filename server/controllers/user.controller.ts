import { RequestHandler, Request, Response, NextFunction } from 'express';
import log from '../logger/index';
import { RowDataPacket } from 'mysql2';
import pool from '../models/userModel';
import bcrypt from 'bcrypt';
const saltRounds = 5;
import dotenv from 'dotenv';
dotenv.config();

// find user via email
export const findUser = async (email: string) => {
  log.info('Finding user (helper function)');
  const queryStr: string = 'SELECT * FROM users WHERE email = ?';
  return pool.query(queryStr, [email]);
};

// Creating user via Google OAuth
export const createUser = async (user: string[]) => {
  log.info('Creating user (helper function)');
  const queryStr: string =
    'INSERT IGNORE INTO users (sub, full_name, email, picture) VALUES (?, ?, ?, ?)';
  pool
    .query(queryStr, user)
    .then(() => log.info('createUser: successfully created User'))
    .catch((err: ErrorEvent) => {
      log.error('This is the error in createUser: ', err);
      throw new Error('Error on createUser: Could not create new user on DB.');
    });
};

// Register w/o OAuth
export const userRegistration: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info('Registering user (middleware)');
  // w/OAuth
  if (req.body.code) {
    try {
      if (res.locals.userInfo.type === 'google') {
        const { id, email, verified_email, name, picture, type } = res.locals.userInfo;
        console.log(res.locals.userInfo);
        const queryStr =
          'INSERT IGNORE INTO users(full_name, email, password, picture,type) Values (?,?,?,?,?)';
        const hashedPw = id.toString();
        const createUser = await pool.query(queryStr, [
          name,
          email,
          hashedPw,
          picture,
          type,
        ]);
        const user = (await findUser(email)) as RowDataPacket[][];
        res.locals.user = user[0][0];
        log.info('created Oauth user');
        return res.status(200).json(res.locals.user);
      } else {
        const { login, id, url, avatar_url, type } = res.locals.userInfo;
        const queryStr =
          'INSERT IGNORE INTO users (full_name, email , password , picture, type) VALUES (?,?,?,?,?)';
        let hashedPw: string;
        hashedPw = id ? id.toString() : 'default';
        const addUser = await pool.query(queryStr, [
          login,
          url,
          hashedPw,
          avatar_url,
          type,
        ]);
        const user = (await findUser(url)) as RowDataPacket[][];
        res.locals.user = user[0][0];
        log.info('creater Oauth user');
        return res.status(200).json(res.locals.user);
      }
    } catch {
      const errorObj = {
        log: 'Express error handler caught in registering Oauth User',
        status: 509,
        message: 'Error caught in Oauth User creation',
      };
      console.log(errorObj.log);
      return res.status(506).json(errorObj.log);
    }
  }
  // w/o Oauth
  else {
    try {
      const foundUser = (await findUser(req.body.email)) as RowDataPacket[][];
      if (foundUser[0]?.length)
        return res.status(403).json({ err: 'Email already in use' });

      const { full_name, email, password } = req.body;
      // console.log(typeof full_name, typeof email, typeof password)
      if (
        typeof full_name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      )
        return next({
          log: 'Error in user.controller.userRegistration',
          status: 400,
          message: 'err: User data must be strings',
        });

      const hashedPw = await bcrypt.hash(password, saltRounds);
      const queryStr: string =
        'INSERT IGNORE INTO users (full_name, email, password) VALUES (?, ?, ?)';
      pool
        .query(queryStr, [full_name, email, hashedPw])
        .then(() => {
          log.info(`${email} successfully registered`);
          return res.redirect(200, '/');
        })
        .catch((err: ErrorEvent) => next(err));
    } catch (err) {
      next(err);
    }
  }
};

export const verifyUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info('Verifying user (middleware)');

  if (req.body.code) {
    let user;
    if (res.locals.userInfo.type === 'google') {
      console.log('in finduser');
      user = (await findUser(res.locals.userInfo.email)) as RowDataPacket[][];
    } else {
      user = (await findUser(res.locals.userInfo.url)) as RowDataPacket[][];
    }
    if (user[0][0]) {
      res.locals.user = user[0][0];
      // return res.status(200).json(res.locals.user);
      return next();
    } else {
      console.log('did not find user');
      return next();
    }
  }

  //other use regular login  methods
  else {
    if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string')
      return next({
        log: 'Error in user.controller.userRegistration',
        status: 400,
        message: 'err: User data must be strings',
      });
    // foundUser structure: [[RowDataPackets], [metadata]]
    const foundUser = (await findUser(req.body.email)) as RowDataPacket[][];
    // verify user exists in db
    if (!foundUser[0][0]) {
      log.error('Email address not found');
      return res.status(401).json({ err: 'Email address not found' });
    }
    // check for pw match
    const hashedPW: string = foundUser[0][0]?.password;
    const match: boolean = await bcrypt.compare(req.body.password, hashedPW);
    if (match) {
      log.info('Username/Password confirmed');
      res.locals.user = foundUser[0][0];
      console.log(res.locals.user);
      return res.status(200).json(res.locals.user);
    } else {
      log.error('Incorrect password');
      return res.redirect(401, '/login');
    }
  }
};

// Save currentSchema into database
export const saveSchema: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info(`Saving user's schema (middleware)`);
  if (typeof req.body.email !== 'string' || typeof req.body.schema !== 'string')
    return next({
      log: 'Error in user.controller.userRegistration',
      status: 400,
      message: 'err: User data must be strings',
    });
  const updateColQuery: string = `UPDATE users SET pg_schema = '${req.body.schema}' WHERE email = '${req.body.email}';`;
  pool
    .query(updateColQuery)
    .then(() => {
      log.info('schema saved');
      return res.sendStatus(200);
    })
    .catch((err: ErrorEvent) => next(err));
};

// Retrieve saved schema
export const retrieveSchema: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info(`Retrieving saved user's saved schema (middleware)`);
  try {
    const updateColQuery: string = `SELECT pg_schema FROM users WHERE email = '${req.params.email}';`;
    const data = (await pool.query(updateColQuery)) as RowDataPacket[][];
    if (data[0][0]) {
      if (data[0][0].pg_schema) return res.status(200).json(data[0][0].pg_schema);
    } else return res.sendStatus(204);
  } catch (err: unknown) {
    return next(err);
  }
};
