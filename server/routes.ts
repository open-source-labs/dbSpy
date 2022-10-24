import { Express, Request, Response, NextFunction } from 'express';
import { handleGoogleAuth } from './controllers/sessionsController';
import { router } from './routes/api';
import apiMySQLRouter from './routes/apiMySQL';
// import * as redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import dotenv from 'dotenv'
dotenv.config();
import Redis from 'ioredis'
import cors from 'cors'


const routes = async (app: Express) => {

    // setup UpStash client and Redis store 
    const RedisStore = connectRedis(session);
    // const client = redis.createClient({
    //     url: `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
    // }) as any;

    // await client.on('connect', () => {
    //     console.log('connected to redis successfully!');
    // })
    const client = new Redis(`rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`)

    // client.set('foo, ')
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

    app.get('/api/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

    app.get('/api/oauth/google', handleGoogleAuth)

    app.get('/api/sql/postgres', router)

    app.get('/api/sql/mysql', apiMySQLRouter)

    app.get('/api/logout', (res: Response, req: Request) => {
        req.session.destroy((err) => {
            res.redirect('localhost:8080/')
        })
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