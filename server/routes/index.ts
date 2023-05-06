import express, { Express, Request, Response, NextFunction } from 'express';
import { handleGoogleAuth, getGoogleAuthUrl } from '../controllers/auth.controller';
import { getGoogleAccesToken, getUserInfo } from '../controllers/oauth.controller';
import { retrieveSchema, saveSchema, userRegistration, verifyUser } from '../controllers/user.controller';
import { postgresRouter } from './postgres.router';
import { microsoftRouter } from './microsoft.router';
import { oracleRouter } from './oracle.router';
import { mysqlRouter } from './mysql.router';
import { sqliteRouter } from './sqlite.router';
import dotenv from 'dotenv';
dotenv.config();
import { getCurrentUser } from '../service/session.service';
import path from 'path';
import log from '../logger/index';
import type { DefaultErr } from '../../src/Types';
//import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    type: string,             // NOTE ON TYPE: When trying to assign a type to 'type' on a data source in the controllers
    host?: string,            // it can only be one string of the possible databases available to typeORM. This makes
    hostname?: string,        // trying to dynamically type it based on data from a front end request difficult.
    port?: string | number,   // Because of that you will see that 'type' is typed as  'db_type as "string of db type"'.
    username?:string,         
    password?: string,
    database?: string,
    database_name?: string,
    service_name?: string,
    synchronize?: boolean,
    logging?: boolean,
    db_type?: string,
    file_path?: string,
  }
}

const routes = async (app: Express) => {

  app.get('/api/healthcheck', (_req: Request, res: Response) => res.sendStatus(200));

  app.post('/api/oauth', getGoogleAccesToken, getUserInfo , verifyUser)

  // app.get('/api/oauth/google', handleGoogleAuth);

  // app.get('/api/googleAuthUrl', getGoogleAuthUrl);

  app.use('/api/sql/postgres', cookieSession, postgresRouter);

  app.use('/api/sql/mysql', cookieSession, mysqlRouter);

  app.use('/api/sql/mssql', cookieSession, microsoftRouter);

  app.use('/api/sql/oracle', cookieSession, oracleRouter);

  app.use('/api/sql/sqlite', cookieSession, sqliteRouter);

  app.post('/api/saveSchema', saveSchema);

  app.get('/api/retrieveSchema/:email', retrieveSchema);

  app.post('/api/userRegistration', userRegistration);

  app.post('/api/verifyUser', verifyUser);

  app.use('/api/me', getCurrentUser);

  app.use('/api/logout', (req, res) => {
    req.session.destroy((err: ErrorEvent) => {
      if (err) log.info('Error destroying session:', err);
      else {
        log.info('Successfully destroyed session');
        return res.redirect(`/`);
      }
    });
  });

  app.get('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });

  // Global Error Handler
  app.use((err: ErrorEvent, _req: Request, res: Response, _next: NextFunction) => {

    const defaultErr: DefaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: 'An error occurred. This is the global error handler.',
    };
    
    const errorObj = Object.assign({}, defaultErr, err);
    log.error(errorObj.message);
    log.error(errorObj.log);
    console.log(err)
    return res.status(errorObj.status).json(errorObj.message);
  });
};

export const cookieSession = (req: Request, _res: Response, next: NextFunction) => {
  //app.get('/', (_req: Request, _res: Response, next: NextFunction) => {
    const { db_type, hostname, password, port, username, database_name, service_name, file_path } = req.query;
    try {
      if (typeof db_type === 'string') {
        req.session.db_type = db_type;
    } if (typeof hostname === 'string') {
      req.session.hostname = hostname;
    } if (typeof password === 'string') {
      req.session.password = password;
    }  if (typeof port === 'string') {
      req.session.port = port;
    } if (typeof username === 'string') {
      req.session.username = username;
    }  if (typeof database_name === 'string') {
      req.session.database_name = database_name;
    } if (typeof service_name === 'string') {
      req.session.service_name = service_name;
    } if (typeof file_path === 'string') {
      req.session.file_path === file_path;
    }
    console.log('Cookie has been set and is saving session data')
  } catch (err: unknown) {
    console.log('error was found in cookeSession: ', err)
    return next(err);
  }
// })
return next();
}

export default routes;
