import { Express, Request, Response, NextFunction, Router } from 'express';
import { handleGoogleAuth } from '../controllers/auth.controller';
import { postgresRouter } from './postgres.router';
import mysqlRouter from './mysql.router';
import session from 'express-session';
declare module "express-session" {
  interface SessionData {
    user: string;
  }
}
import connectRedis from 'connect-redis'
import dotenv from 'dotenv'
dotenv.config();
import Redis from 'ioredis'
import cors from 'cors'
import { getCurrentUser } from '../service/session.service'

// TODO: DEV_CLIENT_ENDPOINT doesn't exist etc.
const client_url = process.env.NODE_ENV === 'development' ? process.env.DEV_CLIENT_ENDPOINT : process.env.CLIENT_ENDPOINT


const routes = async (app: Express) => {
  // setup UpStash client and Redis store 
  const RedisStore = connectRedis(session);

  const client = new Redis(`rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`)

  app.use(cors())

  // set session cookie
  app.use(session({
    store: new RedisStore({ client }),
    secret: process.env.REDIS_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.ENVIRONMENT === 'production' ? true : 'auto',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    }
  }))

  // TODO: Healthcheck is a test. Doesn't require testing - can add a server listener event instead
  app.get('/api/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

  app.get('/api/oauth/google', handleGoogleAuth)

  app.use('/api/sql/postgres', postgresRouter)

  app.use('/api/sql/mysql', mysqlRouter)

  app.use('/api/me', getCurrentUser)

  // TODO: Never called in frontend currently
  app.use('/api/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if(err) console.log('Error destroying session:', err)
      else {
        console.log('Succesfully destroyed session')
        return res.redirect(`${client_url}/`)
      }
    });
  })

  // Global Error Handler
  app.use((err: ErrorEvent, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: 'An error occurred. This is the global error handler.',
    };
    const errorObj = Object.assign({}, defaultErr, err);
    return res.status(errorObj.status).json(errorObj.message);
  });

}

export default routes;