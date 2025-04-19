import { RequestHandler, Request, Response, NextFunction } from 'express';
import log from '../logger/index';
import { RowDataPacket } from 'mysql2';
import pool from '../models/userModel';
import bcrypt from 'bcrypt';
const saltRounds = 5;
import { config } from 'dotenv';
config();

interface GlobalError {
  log: string;
  status: number;
  message: string | { err: string };
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
    await pool.query(queryStr, user);
    log.info('[userCtrl - createUser] Successfully created user');
  } catch (err: unknown) {
    log.error('[userCtrl - createUser] Unable to create new user: ' + err);
    throw new Error('[userCtrl - createUser] Unable to create new user in DB.');
  }
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
        // userInfo.type default is 'github'
        const { login, id, url, avatar_url, type } = res.locals.userInfo;

        // checks if GitHub user exists already
        const userQueryStr = 'SELECT email FROM users WHERE email = ?';
        const foundUserGithub = (await pool.query(userQueryStr, [
          url,
        ])) as RowDataPacket[][];

        // if exists, log statement then retrieve info after if-else
        // else create new user into db
        if (foundUserGithub[0]?.length) {
          log.info('[userCtrl - userReg] User exists from GitHub OAuth already!');
        } else {
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
        }
        const user = (await findUser(url)) as RowDataPacket[][];
        console.log('USER REG GH: ', user);
        res.locals.user = user[0][0];
        log.info('[userCtrl - userReg] Created user from GitHub OAuth');
        return next();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const error: GlobalError = {
          log:
            '[userCtrl - userReg] There was a problem registering with OAuth: ' +
            err.message,
          status: 500,
          message: 'Failed to register user with OAuth',
        };

        return next(error);
      } else {
        return next(err);
      }
    }
  }
  // w/o Oauth
  else {
    try {
      const foundUser = (await findUser(req.body.email)) as RowDataPacket[][];
      if (foundUser[0]?.length) {
        return res.status(403).json({
          err: 'Registration failed. Please check your information and try again.',
        });
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
          message: 'User data must be strings',
        };

        return next(error);
      }

      const hashedPw = await bcrypt.hash(password, saltRounds);
      const queryStr: string =
        'INSERT IGNORE INTO users (full_name, email, password) VALUES (?, ?, ?)';
      pool
        .query(queryStr, [full_name, email, hashedPw])
        .then(() => {
          log.info(`${email} successfully registered`);
          res.locals.userInfo = { name: full_name, email: email };
          res.locals.user = { email: email };
          return next();
        })
        .catch((err: ErrorEvent) => next(err));
    } catch (err: unknown) {
      if (err instanceof Error) {
        const error: GlobalError = {
          log:
            '[userCtrl - userReg] There was a problem registering from input: ' +
            err.message,
          status: 500,
          message: 'Failed to register user from input',
        };
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
    // Sanitze user inputs to prevent SQL injection attacks
    const { email } = req.body;
    const { password } = req.body;
    // Data received from request should contain email and password as string types
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(401).json({ error: 'User data must be strings' });
    }

    /**
     * Search database for user with matching email
     * foundUser structure: [[RowDataPackets], [metadata]]
     */
    const foundUser = (await findUser(email)) as RowDataPacket[][];

    /**
     * Exits middleware and returns an error if user provided email does not exist
     * in the database.
     */
    if (!foundUser[0][0]) {
      log.error('[userCtrl - verifyUser] Email address not found');
      return res.status(401).json({ error: 'Unable to verify user' });
    }

    // Bcrypt compares hashed password stored in database with user provided password.
    const hashedPW: string = foundUser[0][0]?.password;
    const match: boolean = await bcrypt.compare(password, hashedPW);

    if (match) {
      log.info('[userCtrl - verifyUser] Username/Password confirmed');
      res.locals.verified = foundUser[0][0];
      res.locals.userInfo = {
        name: foundUser[0][0].full_name,
        email: foundUser[0][0].email,
      };

      if (req.session) {
        req.session.user = {
          id: 0,
          email: res.locals.userInfo.email,
          username: res.locals.userInfo.name,
          type: 'auth',
        };
      }
      console.log('checking req.session.user: ', req.session.user);

      return next();
    } else {
      log.error('[userCtrl - verifyUser] Username/Password do not match');

      return res.redirect(401, '/login');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: GlobalError = {
        log: '[userCtrl - verifyUser] There was a problem verifying user: ' + err.message,
        status: 500,
        message: 'Unable to verify user',
      };
      return next(error);
    } else {
      return next(err);
    }
  }
};

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  return next();
};

// Save currentSchema into database
export const saveSchema: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info("[userCtrl - saveSchema] Saving user's schema...");
  const { schema } = req.body;
  const { email } = req.session;

  if (typeof email !== 'string' || typeof schema !== 'string') {
    return res.status(400).json({ error: 'User data must be strings' });
  }

  const updateColQuery: string = `UPDATE users SET dbs = ? WHERE email = ?;`;
  try {
    await pool.query(updateColQuery, [schema, email]);
    log.info('[userCtrl - saveSchema] New schema saved successfully');

    return next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: GlobalError = {
        log: '[userCtrl - saveSchema] Failed to save new schema: ' + err.message,
        status: 500,
        message: 'Failed to save new schema',
      };

      return next(error);
    } else {
      return next(err);
    }
  }
};

// Retrieve saved schema
export const retrieveSchema: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info("[userCtrl - retrvSchema] Retrieving user's saved schema");

  try {
    const { email } = req.session;
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
        message: 'Failed to retrieve saved schema',
      };

      return next(error);
    } else {
      return next(err);
    }
  }
};
