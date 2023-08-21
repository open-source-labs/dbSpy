import { config } from 'dotenv';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { RequestHandler } from 'express';

config();

declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

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
