import {Request, Response, NextFunction, RequestHandler} from 'express';
import dotenv from 'dotenv';
import log from '../logger/index';
dotenv.config(); 




export const getGoogleAccesToken: RequestHandler =  (req: Request, res:Response, next:NextFunction)=> {
    
    type code = string;
    const {code} = req.body
    const rootUrl:string = 'https://oauth2.googleapis.com/token';


type Options = {
    code:string,
    client_id:string,
    client_secret:string ,
    redirect_uri:string,
    grant_type:string
}


    const options:Options = {
        code:code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
        redirect_uri:process.env.GOOGLE_OAUTH_REDIRECT_URI as string,
        grant_type: 'authorization_code',
    }

    const qs = new URLSearchParams(options);
    const TokenUrl = `${rootUrl}?${qs.toString()}`;

    fetch(TokenUrl,{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then((data) => data.json())
    .then((data) => {
        res.locals.token = data;
        next();
    })
    .catch((err) => {
        next({
            log:`error exist in oauth.controller.ts in getGoogleAccesToken middleware:  ${err}`,
            status: 500,
            message:`error occurred ${err}`
    })
    })
}

export const getUserInfo:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    const {access_token, expires_in, refresh_token, token_type, id_token} = res.locals.token;
    try{
        const data = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,{
            headers:{'Authorization': `Bearer ${id_token}`}
        })
        const userInfo = await data.json();
        res.locals.userInfo = userInfo;
        next();
    }
    catch(err){
        next({
            log:`error exist in oauth.controller.ts in getUserInfo middleware:  ${err}`,
            status: 500,
            message:`error occurred ${err}`
    })
    }







}
