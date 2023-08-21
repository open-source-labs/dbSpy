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
    const { id, email }: { id: string; email: string } = res.locals.userInfo;

    // create an access token to be provided on every call user makes to backend
    // expires in 1 day
    const payload = { user: id, session: 'session' };

    // create a session
    // refresh token expires in 1 day
    const accessToken = jwt.sign(payload, process.env.TOKEN_KEY as string, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });

    req.session.user = accessToken;
    console.log(accessToken, 'access token');

    return res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json(res.locals.user);
  } catch (error: unknown) {
    log.info(error, 'User authorization failed');
    return res.redirect(301, `${client_url}/login`);
  }
};

export const verifyJwtToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, email }: { id: string; email: string } = res.locals.userInfo;
  } catch (error: unknown) {
    log.info(error, 'User authorization failed');
    return res.redirect(301, `${client_url}/login`);
  }
};
