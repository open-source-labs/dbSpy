import {Request, Response, NextFunction, RequestHandler} from 'express';
import dotenv from 'dotenv';
import log from '../logger/index';
dotenv.config(); 

export const getGoogleAccesToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    type code = string;
    type state = string|null;
    const {code,state} = req.body;
    //Google Oauth options
    let rootUrl:string = 'https://oauth2.googleapis.com/token';
    let type = "GOOGLE"
    //if state exist it only pertains to google github Oauth flagging us to change rootUrl to github
    if(state){
        rootUrl = 'https://github.com/login/oauth/access_token';
        type = "GITHUB"
    } 

type Options = {
    code: string,
    client_id: string,
    client_secret: string ,
    redirect_uri: string,
    grant_type: string,
}


    const options: Options = {
        code: code,
        client_id: process.env[`${type}_OAUTH_CLIENT_ID`] as string,
        client_secret: process.env[`${type}_OAUTH_CLIENT_SECRET`] as string,
        redirect_uri:process.env[`${type}_OAUTH_REDIRECT_URI`] as string,
        grant_type: 'authorization_code',
    }

    const qs = new URLSearchParams(options);
    const TokenUrl = `${rootUrl}?${qs.toString()}`;
    console.log(TokenUrl);
    fetch(TokenUrl,{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then((data) =>{
        if(data.status >= 200 && data.status <300 ){
            if(type === 'GITHUB') return data.text();
            else return data.json();
        }else{
            throw new Error('error exist in oauthcontroller.ts in getGoogleAccesToken middleware');
        }

    })
    .then((data: string|{}) => {
        if(type === 'GITHUB') {
            const resText = new URLSearchParams(data);
             data = {
                access_token: resText.get('access_token'),
                scope:resText.get('scope'),
                token_type: resText.get('token_type'),
                type:'GITHUB'
            }
        }
        res.locals.token = data;
        return next();
    })
    .catch((err) => {
        return next({
            log:`error exist in oauth.controller.ts in getGoogleAccesToken middleware:  ${err}`,
            status: 500,
            message:`error occurred ${err}`
    });
    })
}

export const getUserInfo:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    const {access_token, expires_in, refresh_token, token_type, id_token,type} = res.locals.token;
    try{
        let data: any;
        // For Github Oauth
        let userInfo:{};
        if(type === 'GITHUB'){
             data = await fetch('https://api.github.com/user',{
                headers:{
                    'Authorization': `Bearer ${access_token}`
                }
            })
            if(data.status >= 200 && data.status < 300){
                userInfo = await data.json()
                userInfo = {...userInfo, type:'github'}
            }else{
                 throw new Error('error exist in oauthcontroller.ts in getUserInfo middleware');
            }

        }
        //For Google Oauth
        else {
             data = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,{
                headers:{'Authorization': `Bearer ${id_token}`}
            })
            if(data.status >= 200 && data.status < 300){
                userInfo = await data.json()
                userInfo = {...userInfo, type:'google'}
            }else{
                throw new Error('error exist in oauthcontroller.ts in getUserInfo middleware');
            }
        }
        res.locals.userInfo = userInfo;
        return next();
    }
    catch(err){
        next({
            log:`error exist in oauth.controller.ts in getUserInfo middleware:  ${err}`,
            status: 500,
            message:`error occurred ${err}`
    });
    };
};
