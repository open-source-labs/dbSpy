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

export const handleGoogleAuth: RequestHandler = async (req, res) => {
  // get code from qs
  const code = req.query.code as string;

  try {
    // get the id and access token w/ the code
    const { id_token, access_token } = await getGoogleAuthToken({ code });

    //get user with tokens
    const decodedUser = jwt.decode(id_token) as JwtPayload;

    if (!decodedUser.email_verified) {
      req.session.destroy((err) => {
        // res.redirect('localhost:8080/')
        return res
          .status(403)
          .send('Unable to authorize, google account is not verified.');
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
    const newUser = await findUser(decodedUser.email);

    const user = (await foundUser) || newUser;

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

    const queryStr = 'true';

    log.info(client_url);
    res.redirect(301, `${client_url}/?success=` + queryStr);
  } catch (error) {
    log.info(error, 'User authorization failed');
    return res.redirect(301, `${client_url}/login`);
  }
};

export const getGoogleAuthUrl: RequestHandler = (req, res) => {
  const base = 'https://accounts.google.com/o/oauth2/v2/auth';

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
