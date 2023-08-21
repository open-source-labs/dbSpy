import { RequestHandler, Request, Response, NextFunction } from 'express';
import log from '../logger/index';
import { RowDataPacket } from 'mysql2';
import pool from '../models/userModel';
import bcrypt from 'bcrypt';
const saltRounds = 5;
import { config } from 'dotenv';
config();

interface GlobalError {
  log: string,
  status: number,
  message: string | { err: string }
}

// find user via email
export const findUser = async (email: string) => {
  log.info('[userCtrl - findUser] Searching for user with email');
  const queryStr: string = 'SELECT * FROM users WHERE email = ?';
  return pool.query(queryStr, [email]);
};

// Creating user via Google OAuth
export const createUser = async (user: string[]) => {
  log.info('[userCtrl - createUser] Creating user from inputs');
  const queryStr: string =
    'INSERT IGNORE INTO users (sub, full_name, email, picture) VALUES (?, ?, ?, ?)';
  try {
    await pool.query(queryStr, user)
    log.info('[userCtrl - createUser] Successfully created user');
  } catch (err: unknown) {
      log.error('[userCtrl - createUser] Unable to create new user: ' + err);
      throw new Error('[userCtrl - createUser] Unable to create new user in DB.');
  };
};

// Register w/o OAuth
export const userRegistration: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info('[userCtrl - userReg] Registering new user signup...');
  // w/OAuth
  if (req.body.code) {
    try {
      if (res.locals.userInfo.type === 'google') {
        const { id, email, name, picture, type } = res.locals.userInfo;
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
        log.info('[userCtrl - userReg] Created user from Google OAuth');
        return next();
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
        log.info('[userCtrl - userReg] Created user from GitHub OAuth');
        return next();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const error: GlobalError = {
          log: '[userCtrl - userReg] There was a problem registering with OAuth: ' + err.message,
          status: 500,
          message: 'Failed to register user with OAuth',
        };

        return next(error);
      } else {
        return next(err)
      }
    }
  }
  // w/o Oauth
  else {
    try {
      const foundUser = (await findUser(req.body.email)) as RowDataPacket[][];
      if (foundUser[0]?.length) {
        return res.status(403).json({ err: 'Registration failed. Please check your information and try again.' });
      }

      const { full_name, email, password } = req.body;
      if (
        typeof full_name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        const error: GlobalError = {
          log: '[userCtrl - userReg] Invalid input types for user registration',
          status: 400,
          message: 'User data must be strings'
        }
        
        return next(error);
      }

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        const error: GlobalError = {
          log: '[userCtrl - userReg] There was a problem registering from input: ' + err.message,
          status: 500,
          message: 'Failed to register user from input',
        }
        return next(error);
      } else {
        return next(err);
      }
    }
  }
};

export const verifyUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info('[userCtrl - verifyUser] Verifying user information...');

  try {
  // OAuth login methods
  if (req.body.code) {
    let user;
      if (res.locals.userInfo.type === 'google') {
        const { email } = res.locals.userInfo;
        user = (await findUser(email)) as RowDataPacket[][];
      } else {
        const { url } = res.locals.userInfo;
        user = (await findUser(url)) as RowDataPacket[][];
      }
  
      if (!user[0][0]) {
        return res.status(401).json({ error: 'Unable to verify user' });
      }

      log.info('[userCtrl - verifyUser] OAuth user verified')
      res.locals.verified = user[0][0];

      return next();
    } else {
      // Regular login method
      if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
        return res.status(401).json({ error: 'User data must be strings' });
      }
      
      // foundUser structure: [[RowDataPackets], [metadata]]
      const foundUser = (await findUser(req.body.email)) as RowDataPacket[][];
      // verify user exists in db
      if (!foundUser[0][0]) {
        log.error('[userCtrl - verifyUser] Email address not found');
        return res.status(401).json({ error: 'Unable to verify user' });
      }
      // check for pw match
      const hashedPW: string = foundUser[0][0]?.password;
      const match: boolean = await bcrypt.compare(req.body.password, hashedPW);
      if (match) {
        log.info('[userCtrl - verifyUser] Username/Password confirmed');
        res.locals.verified = foundUser[0][0];

        return next();
      } else {
        log.error('[userCtrl - verifyUser] Username/Password do not match')
        
        return res.redirect(401, '/login');
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: GlobalError = {
        log: '[userCtrl - verifyUser] There was a problem verifying user: ' + err.message,
        status: 500,
        message: 'Unable to verify user',
      }
      return next(error);
    } else {
      return next(err);
    }
  }
  };

// Save currentSchema into database
export const saveSchema: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  log.info('[userCtrl - saveSchema] Saving user\'s schema...');
  const { email, schema } = req.body;
  
  if (typeof email !== 'string' || typeof schema !== 'string') {
    return res.status(400).json({ error: 'User data must be strings' });
  }

    const updateColQuery: string = `UPDATE users SET dbs = ? WHERE email = ?;`;
    try {
      await pool.query(updateColQuery, [schema, email]);
      log.info('[userCtrl - saveSchema] New schema saved successfully')

      return next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const error: GlobalError = {
          log: '[userCtrl - saveSchema] Failed to save new schema: ' + err.message,
          status: 500,
          message: 'Failed to save new schema'
        }

        return next(error);
      } else {
        return next(err)
      }
    }
};

// Retrieve saved schema
export const retrieveSchema: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info('[userCtrl - retrvSchema] Retrieving user\'s saved schema');

  try {
    const { email } = req.params;
    const updateColQuery: string = `SELECT dbs FROM users WHERE email = ?;`;
    const data = (await pool.query(updateColQuery, [email])) as RowDataPacket[];

    if (data[0][0] && data[0][0].dbs) {
      res.locals.data = data[0][0].dbs;

      return res.status(200).json(res.locals.data);
    } else {
      return res.sendStatus(204);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: GlobalError = {
        log: '[userCtrl - retrvSchema] Failed to retrieve saved schema: ' + err.message,
        status: 500,
        message: 'Failed to retrieve saved schema'
      }

      return next(error);
    } else {
      return next(err)
    }
  }
};
