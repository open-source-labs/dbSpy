"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getGoogleAccesToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getGoogleAccesToken = (req, res, next) => {
    const { code, state } = req.body;
    //Google Oauth options
    let rootUrl = 'https://oauth2.googleapis.com/token';
    let type = "GOOGLE";
    //if state exist it only pertains to google github Oauth flagging us to change rootUrl to github
    if (state) {
        rootUrl = 'https://github.com/login/oauth/access_token';
        type = "GITHUB";
    }
    const options = {
        code: code,
        client_id: process.env[`${type}_OAUTH_CLIENT_ID`],
        client_secret: process.env[`${type}_OAUTH_CLIENT_SECRET`],
        redirect_uri: process.env[`${type}_OAUTH_REDIRECT_URI`],
        grant_type: 'authorization_code',
    };
    const qs = new URLSearchParams(options);
    const TokenUrl = `${rootUrl}?${qs.toString()}`;
    console.log(TokenUrl);
    fetch(TokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((data) => {
        if (type === 'GITHUB')
            return data.text();
        else
            return data.json();
    })
        .then((data) => {
        if (type === 'GITHUB') {
            const resText = new URLSearchParams(data);
            data = {
                access_token: resText.get('access_token'),
                scope: resText.get('scope'),
                token_type: resText.get('token_type'),
                type: 'GITHUB'
            };
        }
        res.locals.token = data;
        next();
    })
        .catch((err) => {
        next({
            log: `error exist in oauth.controller.ts in getGoogleAccesToken middleware:  ${err}`,
            status: 500,
            message: `error occurred ${err}`
        });
    });
};
exports.getGoogleAccesToken = getGoogleAccesToken;
const getUserInfo = async (req, res, next) => {
    const { access_token, expires_in, refresh_token, token_type, id_token, type } = res.locals.token;
    try {
        let data;
        // For Github Oauth
        let userInfo;
        if (type === 'GITHUB') {
            data = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            userInfo = await data.json();
            userInfo = { ...userInfo, type: 'github' };
        }
        //For Google Oauth
        else {
            data = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
                headers: { 'Authorization': `Bearer ${id_token}` }
            });
            userInfo = await data.json();
            userInfo = { ...userInfo, type: 'google' };
        }
        res.locals.userInfo = userInfo;
        next();
    }
    catch (err) {
        next({
            log: `error exist in oauth.controller.ts in getUserInfo middleware:  ${err}`,
            status: 500,
            message: `error occurred ${err}`
        });
    }
};
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=oauth.controller.js.map