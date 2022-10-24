import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response } from "express"
import log from "../logger/index"
import { getGoogleAuthToken } from "../utils/getGoogleAuthToken"
import { createUser, findUser } from "./userController"

export const handleGoogleAuth = async (req: Request, res: Response) => {
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


        //set a cookie, redirect back to the client

        res.redirect('localhost:8080/')

    } catch (error) {
        log.error(error, "User authorization failed")
        return res.redirect('localhost:8080/')
    }
}