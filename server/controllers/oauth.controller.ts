import { Request, Response, NextFunction, RequestHandler } from 'express';
import { config } from 'dotenv';
import log from '../logger/index';
config();

interface GlobalError {
  log: string;
  status: number;
  message: string | { err: string };
}

interface GitHubUser {
  id: number;
  url: string; // this is equivalent to the user email, is stored in the db as well
  login: string;
  type: string;
}

export const getAccesToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info('[oauthCtrl - getAccToken] Getting user access token...');
  // checks if user email already exists
  if (req.session.user?.email) {
    return res.redirect('/api/me');
  }

  type code = string;
  type state = string | null;
  const { code, state } = req.body;
  // Google Oauth options: rootUrl points to Google's access token endpoint
  let rootUrl: string = 'https://oauth2.googleapis.com/token';
  let type = 'GOOGLE';

  /**
   * If the 'state' parameter is present, it indicates GitHub OAuth process is being used.
   * rootUrl is updated to point to GitHub's access token endpoint and the 'type'
   * is set to GitHub.
   */
  if (state) {
    log.info('[oauthCtrl - getAccToken] Client signing in with GitHub OAuth');
    rootUrl = 'https://github.com/login/oauth/access_token';
    type = 'GITHUB';
  }

  type Options = {
    code: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    grant_type: string;
  };

  /**
   * For future iterations, ensure .env information is properly set:
   * Relevant sensitive information should be kept in .env
   * options gets from .env based on 'type' parameter set above.
   */
  const options: Options = {
    code: code,
    client_id: process.env[`${type}_OAUTH_CLIENT_ID`] as string,
    client_secret: process.env[`${type}_OAUTH_CLIENT_SECRET`] as string,
    redirect_uri: process.env[`${type}_OAUTH_REDIRECT_URI`] as string,
    grant_type: 'authorization_code',
  };

  const qs = new URLSearchParams(options);
  const TokenUrl = `${rootUrl}?${qs.toString()}`;

  fetch(TokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((data) => {
      if (data.status >= 200 && data.status < 300) {
        log.info(
          `[oauthCtrl - getAccToken] Successful response from ${type} OAuth server`
        );
        if (type === 'GITHUB') return data.text();
        else return data.json();
      } else {
        throw new Error(
          `[oauthCtrl - getAccToken] middleware error: Unexpected response status ${data.status}`
        );
      }
    })

    .then((data: string | {}) => {
      if (type === 'GITHUB') {
        const resText = new URLSearchParams(data);
        data = {
          access_token: resText.get('access_token'),
          scope: resText.get('scope'),
          token_type: resText.get('token_type'),
          type: 'GITHUB',
        };
      }
      res.locals.token = data;
      return next();
    })
    .catch((err) => {
      const error: GlobalError = {
        log: `[oauthCtrl - getAccToken] Error in ${type} OAuth process: ${err.message}`,
        status: 500,
        message: `Error occurred: ${err.message}`,
      };
      return next(error);
    });
};

export const getUserInfo: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info('[oauthCtrl - getUserInfo] Retrieving user information...');

  const { access_token, expires_in, refresh_token, token_type, id_token, type } =
    res.locals.token;
  console.log('res.locals.token from GH Oauth: ', res.locals.token);

  try {
    let data: any;
    // For Github Oauth
    let userInfo: GitHubUser;

    if (type === 'GITHUB') {
      data = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (data.status >= 200 && data.status < 300) {
        log.info('[oauthCtrl - getUserInfo] Received successful response from GitHub');

        userInfo = await data.json();
        userInfo = { ...userInfo, type: 'github' };

        console.log('userInfo from Github: ', userInfo);
        if (req.session) {
          req.session.user = {
            id: userInfo.id,
            email: userInfo.url,
            username: userInfo.login,
            type: 'github',
          };
        }
        console.log('checking req.session.user: ', req.session.user);
      } else {
        throw new Error(
          `[oauthCtrl - getUserInfo] middleware error (GitHub): Unexpected response status ${data.status}`
        );
      }
    }
    //For Google Oauth
    else {
      data = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: { Authorization: `Bearer ${id_token}` },
        }
      );
      if (data.status >= 200 && data.status < 300) {
        log.info('[oauthCtrl - getUserInfo] Received successful response from Google');

        userInfo = await data.json();
        userInfo = { ...userInfo, type: 'google' };
      } else {
        throw new Error(
          `[oauthCtrl - getUserInfo] middleware error (Google): Unexpected response status ${data.status}`
        );
      }
    }

    res.locals.userInfo = userInfo;

    return next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: GlobalError = {
        log: `[oauthCtrl - getUserInfo] Error in ${type} OAuth process: ${err.message}`,
        status: 500,
        message: `Error occurred: ${err.message}`,
      };

      return next(error);
    } else {
      return next(err);
    }
  }
};
