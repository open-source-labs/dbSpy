"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getGoogleAccesToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getGoogleAccesToken = (req, res, next) => {
    const { code } = req.body;
    const rootUrl = 'https://oauth2.googleapis.com/token';
    const options = {
        code: code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
    };
    const qs = new URLSearchParams(options);
    const TokenUrl = `${rootUrl}?${qs.toString()}`;
    fetch(TokenUrl, {
        method: 'POST',
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
            log: `error exist in oauth.controller.ts in getGoogleAccesToken middleware:  ${err}`,
            status: 500,
            message: `error occurred ${err}`
        });
    });
};
exports.getGoogleAccesToken = getGoogleAccesToken;
const getUserInfo = async (req, res, next) => {
    const { access_token, expires_in, refresh_token, token_type, id_token } = res.locals.token;
    try {
        const data = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: { 'Authorization': `Bearer ${id_token}` }
        });
        const userInfo = await data.json();
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