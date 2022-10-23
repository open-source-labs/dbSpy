import { Request, Response } from "express"
import log from "../logger/index"
import { getGoogleAuthToken } from "../utils/getGoogleAuthToken"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { createUser, findUser } from "./userController"
import { LogOutput } from "concurrently"

// interface UserInfo {
//     iss: string;
//     azp: string,
//     aud: string,
//     sub: string,
//     email: string,
//     email_verified: boolean;
//     at_hash: string,
//     name: string,
//     picture: string,
//     given_name: string,
//     family_name: string,
//     locale: string,
//     iat: string,
//     exp: string
// }
interface UserInfo {
    sub: string,
    name: string,
    email: string,
    picture: string,
}

export const handleGoogleAuth = async (req: Request, res: Response) => {
    // get code from qs
    const code = req.query.code as string
    // get the id and access token w/ the code
    const { id_token, access_token } = await getGoogleAuthToken({ code })


    //get user with tokens
    const decodedUser = jwt.decode(id_token) as JwtPayload;

    //insert or retrieve the user
    // log.info(getUser)
    // console.log(decodedUser);
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

    console.log({ foundUser, newUser });


    // create access & refresh tokens


    //set a cookie, redirect back to the client


}