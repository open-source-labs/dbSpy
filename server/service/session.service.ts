import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

export const getCurrentUser: RequestHandler = async (req, res) => {
  if (req?.session?.user) {
    const accessToken = req.session.user;

    const decoded = jwt.verify(
      accessToken as string,
      process.env.TOKEN_KEY as string,
      (err: any, user: any) => {
        if (user.user) return user.user;
      }
    );
    res.status(200).json(decoded);
  }
};
