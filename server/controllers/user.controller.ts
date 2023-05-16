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
      log.error("This is the error in createUser: ", err);
      throw new Error('Error on createUser: Could not create new user on DB.');
    });
};

// Register w/o OAuth
export const userRegistration: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  

  log.info('Registering user (middleware)');

  const foundUser = (await findUser(req.body.email)) as RowDataPacket[][];
  if (foundUser[0].length) return res.status(403).json({ err: 'Email already in use' });

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
};



export const verifyUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  log.info('Verifying user (middleware)');

  //check if login is from Oauth2 and add to database
  if(typeof req.body.code === 'string'){
    if(res.locals.userInfo.type === 'google'){ //for Google
     const {id, email, verified_email, name, picture, type} = res.locals.userInfo;
    
    const queryStr = 'INSERT IGNORE INTO users (full_name, email , password , picture, type) VALUES (?,?,?,?,?)';
    const hashedPw = id.toString();
    if(verified_email){
      const addUser = await pool.query(queryStr,[name, email, hashedPw, picture,type]);
      log.info('verified or added Oauth User');
      const foundUser = (await findUser(email)) as RowDataPacket[][];
      log.info('found user');
      res.locals.user = foundUser[0][0];
      console.log(res.locals.user);
      return res.status(200).json(res.locals.user);
    }
    else{
      log.error('Error in verifyUser OAUTH');
      next(`Email not verified`);
    } 
  }else{// for GITHUB
    const {login,id,url,avatar_url,type} = res.locals.userInfo;
    const queryStr = 'INSERT IGNORE INTO users (full_name, email , password , picture, type) VALUES (?,?,?,?,?)';
    let hashedPw:string;
    //fix bcrypt bug
    if(id) {
       hashedPw = id.toString();
      }else {
        hashedPw = 'default'};
    console.log(hashedPw);
    const addUser = await pool.query(queryStr,[login, url, hashedPw, avatar_url,type]);
    log.info('verified or added Oauth User');
    const foundUser = (await findUser(url)) as RowDataPacket[][];
    log.info('found user');
    res.locals.user = foundUser[0][0];
    console.log(res.locals.user);
    return res.status(200).json(res.locals.user);
  }

  }

  //other use regular login  methods
else{
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
    return res.status(403).json({ err: 'Email address not found' });
  }
  // check for pw match
  const hashedPW: string = foundUser[0][0]?.password;
  const match: boolean = await bcrypt.compare(req.body.password, hashedPW);
  if (match) {
    log.info('Username/Password confirmed');
    res.locals.user = foundUser[0][0];
    console.log(res.locals.user)
    return res.status(200).json(res.locals.user);
  } else {
    log.error('Incorrect password');
    return res.redirect(401, '/login');
  }
}

};

// Save currentSchema into database
export const saveSchema: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
export const retrieveSchema: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  log.info(`Retrieving saved user's saved schema (middleware)`);
  try {
    const updateColQuery: string = `SELECT pg_schema FROM users WHERE email = '${req.params.email}';`;
    const data = (await pool.query(updateColQuery)) as RowDataPacket[][];
    if (data[0][0].pg_schema) return res.status(200).json(data[0][0].pg_schema);
    else return res.sendStatus(204);
  } catch (err: unknown) {
    return next(err);
  }
};
