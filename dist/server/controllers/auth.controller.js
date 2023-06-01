"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleAuthUrl = exports.handleGoogleAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../logger/index"));
const getGoogleAuthToken_1 = require("../utils/getGoogleAuthToken");
const user_controller_1 = require("./user.controller");
const client_url = process.env.NODE_ENV === 'development'
    ? process.env.DEV_CLIENT_ENDPOINT
    : process.env.CLIENT_ENDPOINT;
const handleGoogleAuth = async (req, res, next) => {
    // get code from qs
    const code = req.query.code;
    try {
        // get the id and access token w/ the code
        const { id_token, access_token } = await (0, getGoogleAuthToken_1.getGoogleAuthToken)({ code });
        console.log(`We also have the access token: ${access_token}, but it is not used for anything?`);
        //get user with tokens
        const decodedUser = jsonwebtoken_1.default.decode(id_token);
        if (!decodedUser.email_verified) {
            req.session.destroy((err) => {
                // res.redirect('localhost:8080/')
                res.status(403).send('Unable to authorize, google account is not verified.');
                return next(err);
            });
        }
        //insert or retrieve the user
        const foundUser = await (0, user_controller_1.findUser)(decodedUser.email);
        // // if we did not find the user, create one
        if (!foundUser) {
            (0, user_controller_1.createUser)([
                decodedUser.sub,
                decodedUser.name,
                decodedUser.email,
                decodedUser.picture,
            ]);
        }
        const newUser = await (0, user_controller_1.findUser)(decodedUser.email);
        const user = (await foundUser) || newUser;
        // create an access token to be provided on every call user makes to backend
        // expires in 1 day
        const obj = { user: user[0], session: 'session' };
        // create a session
        // refresh token expires in 1 day
        const accessToken = jsonwebtoken_1.default.sign(obj, process.env.TOKEN_KEY, {
            algorithm: 'HS256',
            expiresIn: '1d',
        });
        req.session.user = accessToken;
        index_1.default.info('Login successful, redirecting...');
        const queryStr = 'true';
        index_1.default.info(client_url);
        res.redirect(301, `${client_url}/?success=` + queryStr);
    }
    catch (error) {
        index_1.default.info(error, 'User authorization failed');
        return res.redirect(301, `${client_url}/login`);
    }
};
exports.handleGoogleAuth = handleGoogleAuth;
const getGoogleAuthUrl = (_req, res) => {
    const base = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: process.env.GOOGLE_AUTH_CALLBACK,
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };
    const queryStr = new URLSearchParams(options);
    return res.status(200).json(JSON.stringify(`${base}?${queryStr.toString()}`));
};
exports.getGoogleAuthUrl = getGoogleAuthUrl;
//# sourceMappingURL=auth.controller.js.map