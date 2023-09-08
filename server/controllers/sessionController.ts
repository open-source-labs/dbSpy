import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { RequestHandler } from 'express';
import log from '../logger/index';
import { config } from 'dotenv';

config();

declare module 'express-session' {
  interface SessionData {
    user: string;
    email: string;
  }
}

const client_url =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_CLIENT_ENDPOINT
    : process.env.CLIENT_ENDPOINT;

export const setJwtToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // destructure name, email, and login username from whichever authentication method was used
    // all authentication methods store the relevant user information in res.locals
    let { name, email, login }: { name: string; email: string; login: string } =
      res.locals.userInfo;

    // if no name value was assigned from github Oauth, assign it to their github username
    if (!name) name = login;
    if (!email) email = `https://api.github.com/users/${name}`;

    // create an access token to be provided on every call user makes to backend
    // expires in 1 day
    const payload = { user: name, session: 'session' };

    // create a session
    // refresh token expires in 1 day
    const accessToken = jwt.sign(payload, process.env.TOKEN_KEY as string, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });

    // store access token and email in the session
    // getCurrentUser uses accessToken, saveSchema and retrieveSchema use the email
    req.session.user = accessToken;
    req.session.email = email;

    return next();
  } catch (error: unknown) {
    log.info(error, 'User authorization failed');
    return res.redirect(301, `${client_url}/login`);
  }
};

export const getCurrentUser: RequestHandler = (req, res) => {
  if (req?.session?.user) {
    const accessToken = req.session.user;

    jwt.verify(
      accessToken as string,
      process.env.TOKEN_KEY as string,
      (_err: VerifyErrors | null, decoded: any) => {
        if (_err) {
          // Logs the error for debugging
          console.error('JWT verification failed: ', _err.message);

          // Return error to client
          return res.status(401).json({ error: 'Invalid token' });
        }

        // respond with the user's name if the access token was successfully verified
        if (decoded?.user) {
          res.status(200).json({ full_name: decoded.user });
        } else {
          res.status(401).json({ error: 'User not found in token' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
};
