import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'


export const getCurrentUser: RequestHandler = async (req, res) => {
    const accessToken = req.session.user;

    const decoded = jwt.verify(accessToken, process.env.TOKEN_KEY as string, (err: any, user: any) => {
        return user.user;

    })
    res.status(200).json(decoded);
}