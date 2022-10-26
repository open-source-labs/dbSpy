import jwt, { JwtPayload, sign } from 'jsonwebtoken'
import { Request, RequestHandler, Response } from "express"
import log from "../logger/index"
import { getGoogleAuthToken } from "../utils/getGoogleAuthToken"
import { createUser, findUser } from "./userController"
declare module "express-session" {
    interface SessionData {
        user: string;
    }
}

export const handleGoogleAuth: RequestHandler = async (req, res) => {
    // get code from qs
    const code = req.query.code as string

    try {
        // get the id and access token w/ the code
        const { id_token, access_token } = await getGoogleAuthToken({ code })


        //get user with tokens
        const decodedUser = jwt.decode(id_token) as JwtPayload;


        if (!decodedUser.email_verified) {
            req.session.destroy((err) => {
                // res.redirect('localhost:8080/')
                return res.status(403).send("Unable to authorize, google account is not verified.")
            })

        }

        //insert or retrieve the user
        const foundUser: any = await findUser(decodedUser.email)

        // // if we did not find the user, create one
        if (!foundUser) {
            createUser([
                decodedUser.sub,
                decodedUser.name,
                decodedUser.email,
                decodedUser.picture
            ])
        }

        const newUser = await findUser(decodedUser.email)

        const user = await foundUser || newUser

        // create an access token to be provided on every call user makes to backend
        // expires in 1 day
        const obj = { user: user[0], session: 'session' }

        const accessToken = jwt.sign(obj, process.env.TOKEN_KEY as string, { algorithm: 'HS256', expiresIn: '1d' })
        // create a session
        //refresh token expires in 1 day
        const refreshToken = jwt.sign(obj, process.env.TOKEN_KEY as string, { algorithm: 'HS256', expiresIn: '5h' })


        req.session.user = accessToken;

        log.info('Login successful, redirecting...')

        const queryStr = 'true'

        res.redirect(301, 'http://localhost:8080/login?success=' + queryStr)

    } catch (error) {
        log.error(error, "User authorization failed")
        res.redirect('http://localhost:8080/')
    }
}