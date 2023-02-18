import { Express, Request, Response, NextFunction } from 'express';
import { handleGoogleAuth, getGoogleAuthUrl } from '../controllers/auth.controller';
import {
  retrieveSchema,
  saveSchema,
  userRegistration,
  verifyUser,
} from '../controllers/user.controller';
import { postgresRouter } from './postgres.router';
import mysqlRouter from './mysql.router';
import session from 'express-session';
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

const routes = async (app: Express) => {
  app.get('/api/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

  app.get('/api/oauth/google', handleGoogleAuth);

  app.get('/api/googleAuthUrl', getGoogleAuthUrl);

  app.use('/api/sql/postgres', postgresRouter);

  app.use('/api/sql/mysql', mysqlRouter);

  app.post('/api/saveSchema', saveSchema);

  app.get('/api/retrieveSchema/:email', retrieveSchema);

  app.post('/api/userRegistration', userRegistration);

  app.post('/api/verifyUser', verifyUser);

  app.use('/api/me', getCurrentUser);

  app.use('/api/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) log.info('Error destroying session:', err);
      else {
        log.info('Succesfully destroyed session');
        return res.redirect(`/`);
      }
    });
  });

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });

  // Global Error Handler
  app.use((err: ErrorEvent, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: 'An error occurred. This is the global error handler.',
    };
    const errorObj = Object.assign({}, defaultErr, err);
    log.error(errorObj.message);
    log.error(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });
};

export default routes;
