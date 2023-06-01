import express from 'express';
import log from './logger/index'
import dotenv from 'dotenv'
import routes from './routes'
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser'
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));

app.use(session({
    secret: Math.floor(Math.random() * 1000000).toString(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
         httpOnly: true,
         path: '/',
         sameSite: true,
         expires: undefined
        }, 
  }));


app.listen(3000, () => {
    log.info(`Securely Running at ${port}`);
    routes(app);
});

export default app;