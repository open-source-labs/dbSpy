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

  /**
   * For future iterations, ensure .env information is properly set:
   * Relevant sensitive information should be kept in .env
   * options gets from .env based on 'type' parameter set above.
   */
  const client_id = process.env[`${type}_OAUTH_CLIENT_ID`] as string;
  const client_secret = process.env[`${type}_OAUTH_CLIENT_SECRET`] as string;
  const redirect_uri = process.env[`${type}_OAUTH_REDIRECT_URI`] as string;

  const params: Record<string, string> = {
    code,
    client_id,
    client_secret,
    redirect_uri,
  };

  if (type === 'GOOGLE') {
    params.grant_type = 'authorization_code';
  }
  const body = new URLSearchParams(params).toString();

  fetch(rootUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(type === 'GITHUB' ? { Accept: 'application/json' } : {}),
    },
    body,
  })
    .then(async (data) => {
      const rawText = await data.text();
      if (!data.ok) {
        throw new Error(`HTTP ${data.status} - ${rawText}`);
      }

      // GitHub may return a form-encoded string if Accept header is not honored
      if (type === 'GITHUB' && rawText.startsWith('access_token=')) {
        const parsed = new URLSearchParams(rawText);
        return {
          access_token: parsed.get('access_token'),
          scope: parsed.get('scope'),
          token_type: parsed.get('token_type'),
          type,
        };
      }
      const jsonData = JSON.parse(rawText);
      return { ...jsonData, type };
    })
    .then((tokenData) => {
      log.info(`[oauthCtrl - getAccToken] Token response: ${JSON.stringify(tokenData)}`);
      res.locals.token = tokenData;
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
