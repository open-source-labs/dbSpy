import { config } from 'dotenv';
import express, { Express } from 'express';
import log from './logger/index';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

config();

const port: number = Number(process.env.PORT) || 3000;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      path: '/',
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000
    },
  })
);

app.listen(3000, () => {
  log.info(`Securely Running at ${port}`);
  routes(app);
});

export default app;
