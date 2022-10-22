import fetch from 'node-fetch';
// import { CodeChallengeMethod, OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
import { RequestHandler } from 'express';
import { URL } from 'url';
import { user } from './userController'
import { google } from 'googleapis';
dotenv.config();


const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.GOOGLE_AUTH_CALLBACK
);


export const getAuthenticatedClient: RequestHandler = async (req, res, next) => {
    // generate the url that will be used for the consent dialog
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        include_granted_scopes: true,

    })
    res.redirect(301, authorizeUrl)
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
        });
    const result = ticket.getPayload();

    res.locals.userInfo = {
        id: result?.sub,
        name: result?.name,
        email: result?.email,
        image: result?.picture
    }
    return next();
}
