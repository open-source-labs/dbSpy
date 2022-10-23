import fetch from 'node-fetch';
// import { CodeChallengeMethod, OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
import { RequestHandler } from 'express';
import { URL } from 'url';
// import { user } from './userController'
import { google } from 'googleapis';
import log from '../logger/index'

dotenv.config();



// const oauth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.GOOGLE_AUTH_CALLBA



// const main = async () => {
//     const oAuth2Client = await getAuthenticatedClient();
//    const res = await oAuth2Client.request()
//     //make a request to the people api

// }

// create an oAuth client to authorize API calls
// const oAuth2Client = new OAuth2Client(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.GOOGLE_AUTH_CALLBACK
// );

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.GOOGLE_AUTH_CALLBACK
);

const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    include_granted_scopes: true,
    prompt: 'consent'
})


// const codes = await oAuth2Client.generateCodeVerifierAsync()
// .then((codeverifier, codeChallege) => )

// const codeV = codes.codeVerifier;

// const codes = async () => await oAuth2Client.generateCodeVerifierAsync()


// const codeChallenge = codes.codeChallenge;
// var codeVerifier = codes.codeVerifier;
log.info(`${process.env.GOOGLE_AUTH_CALLBACK}`)

log.info(`${oAuth2Client}`)

log.info(`${authorizeUrl}`)

export const getAuthenticatedClient: RequestHandler = async (req, res, next) => {
    log.info('in getAuthenticatedClient')
    // generate the url that will be used for the consent dialog
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        include_granted_scopes: true,
        prompt: 'consent'
    })
    log.info(authorizeUrl)
    return;
    // res.redirect(301, authorizeUrl)
}

export const handleOAuthCallBack: RequestHandler = async (req, res, next) => {
    const qs = new URL(req.url, 'http://localhost:3000').searchParams;
    const code = qs.get('code');
    if (!code) throw new Error('Invalid code')
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.locals.token = tokens;
    const ticket = await oAuth2Client.verifyIdToken(
        {
            idToken: res.locals.token.id_token,
            audience: res.locals.token.audience,
            maxExpiry: res.locals.token.expiry_date,
        },
        // (err: any, ticket: { payload: { sub: any; name: any; email: any; picture: any; }; }) => {
        //     res.locals.userInfo = {
        //         id: ticket.payload.sub,
        //         name: ticket.payload.name,
        //         email: ticket.payload.email,
        //         image: ticket.payload.picture,
        //     };
        //     return res.json(res.locals.userInfo)
        // }
    );
    const result = ticket.getPayload();

    // if (result?.email_verified) return next({ status: 500 })
    res.locals.userInfo = {
        id: result?.sub,
        name: result?.name,
        email: result?.email,
        image: result?.picture
    }
    return next();
}





// oauth.getToken = async (req, res, next) => {
//     const code = req.query.code;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials();
//     res.locals.token = tokens;
//     await oauth2Client.verifyIdToken(
//       {
//         idToken: tokens.id_token,
//         audience: process.env.CLIENT_ID,
//         maxExpiry: tokens.expiry_date,
//       },
//       (err, ticket) => {
//         res.locals.userInfo = {
//           id: ticket.payload.sub,
//           name: ticket.payload.name,
//           email: ticket.payload.email,
//           image: ticket.payload.picture,
//         };
//         return next();
//       }
//     );
//   };
