import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestHandler } from 'express';
import log from '../logger/index';
import { getGoogleAuthToken } from '../utils/getGoogleAuthToken';
import { createUser, findUser } from './user.controller';
declare module 'express-session' {
  interface SessionData {
    user: string;
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
    // to work with all authentication methods, res.locals.userInfo.name = 'full name'
    const { name, email }: { id: string; email: string; name: string } =
      res.locals.userInfo;

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
    console.log(accessToken, 'access token');

    console.log(res.locals.user, 'res.locals.user');

    return next();
  } catch (error: unknown) {
    log.info(error, 'User authorization failed');
    return res.redirect(301, `${client_url}/login`);
  }
};
