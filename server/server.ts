import { config } from 'dotenv';
import express, { Express } from 'express';
import log from './logger';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

config(); // load .env variables

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

//Set the payload limit size to 1mb when save a large database data which is TableData in featureTab.
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Core express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies and CORS
app.use(cookieParser());
app.use(cors());

// Serve static files from 'dist'
app.use(express.static(path.join(__dirname, '../dist')));

// Session setup
if (!process.env.SESSION_SECRET) {
  console.error('❌ SESSION_SECRET is not defined in environment variables!');
  process.exit(1); // Exit early if SESSION_SECRET is missing
}

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Start the server
app.listen(port, () => {
  log.info(`✅ Server running securely at ${port}`);
  routes(app); // register routes AFTER all middlewares
});

export default app;
