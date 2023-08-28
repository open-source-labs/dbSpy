import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestHandler } from 'express';
import log from '../logger/index';
import { getGoogleAuthToken } from '../utils/getGoogleAuthToken';
import { createUser, findUser } from './user.controller';
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
    let { name, email, login }: { name: string; email: string; login: string } =
      res.locals.userInfo;

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

    req.session.user = accessToken;
    req.session.email = email;

    return next();
  } catch (error: unknown) {
    log.info(error, 'User authorization failed');
    return res.redirect(301, `${client_url}/login`);
  }
};
