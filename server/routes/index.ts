import express, { Express, Request, Response, NextFunction } from 'express';
import { handleGoogleAuth, getGoogleAuthUrl } from '../controllers/auth.controller';
import { getGoogleAccesToken, getUserInfo } from '../controllers/oauth.controller';
import {
  retrieveSchema,
  saveSchema,
  userRegistration,
  verifyUser,
} from '../controllers/user.controller';
import { postgresRouter } from './postgres.router';
import { microsoftRouter } from './microsoft.router';
import { oracleRouter } from './oracle.router';
import { mysqlRouter } from './mysql.router';
import { sqliteRouter } from './sqlite.router';
import session from 'express-session'; // 
declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}
import dotenv from 'dotenv';
dotenv.config();
import { getCurrentUser } from '../service/session.service';
import path from 'path';
import log from '../logger/index';

import type { DefaultErr } from '../../src/Types';
// import { DataSource } from 'typeorm'
// import { Users } from '../entities/user.entity'

const app = express()

app.use('/api/sql/postgres', postgresRouter);

const routes = async (app: Express) => {

  app.get('/api/healthcheck', (_req: Request, res: Response) => res.sendStatus(200));

  app.post('/api/oauth', getGoogleAccesToken, getUserInfo , verifyUser)

  // app.get('/api/oauth/google', handleGoogleAuth);

  // app.get('/api/googleAuthUrl', getGoogleAuthUrl);

  app.use('/api/sql/postgres', postgresRouter);

  app.use('/api/sql/mysql', mysqlRouter);

  app.use('/api/sql/mssql', microsoftRouter);

  app.use('/api/sql/oracle', oracleRouter);

  app.use('/api/sql/sqlite', sqliteRouter);

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

export default routes;
