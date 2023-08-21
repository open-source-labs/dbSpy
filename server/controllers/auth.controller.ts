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

export const handleGoogleAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get code from qs
  const code = req.query.code as string;

  try {
    // get the id and access token w/ the code
    const { id_token, access_token }: { id_token: string; access_token: string } =
      await getGoogleAuthToken({ code });

    console.log(
      `We also have the access token: ${access_token}, but it is not used for anything?`
    );

    //get user with tokens
    const decodedUser = jwt.decode(id_token) as JwtPayload;

    if (!decodedUser.email_verified) {
      req.session.destroy((err: ErrorEvent) => {
        // res.redirect('localhost:8080/')
        res.status(403).send('Unable to authorize, google account is not verified.');
        return next(err);
      });
    }

    //insert or retrieve the user
    const foundUser: any = await findUser(decodedUser.email);
    // // if we did not find the user, create one
    if (!foundUser) {
      createUser([
        decodedUser.sub,
        decodedUser.name,
        decodedUser.email,
        decodedUser.picture,
      ]);
    }
    const newUser: any = await findUser(decodedUser.email);

    const user: any = (await foundUser) || newUser;

    // create an access token to be provided on every call user makes to backend
    // expires in 1 day
    const obj = { user: user[0], session: 'session' };

    // create a session
    // refresh token expires in 1 day
    const accessToken = jwt.sign(obj, process.env.TOKEN_KEY as string, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });

    req.session.user = accessToken;

    log.info('Login successful, redirecting...');

    const queryStr: string = 'true';

    log.info(client_url);
    res.redirect(301, `${client_url}/?success=` + queryStr);
  } catch (error: unknown) {
    log.info(error, 'User authorization failed');
    return res.redirect(301, `${client_url}/login`);
  }
};

export const getGoogleAuthUrl: RequestHandler = (_req, res) => {
  const base: string = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: process.env.GOOGLE_AUTH_CALLBACK as string,
    client_id: process.env.GOOGLE_AUTH_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const queryStr = new URLSearchParams(options);
  return res.status(200).json(JSON.stringify(`${base}?${queryStr.toString()}`));
};
