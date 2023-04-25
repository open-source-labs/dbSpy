"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleAuthToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const index_1 = __importDefault(require("../logger/index"));
dotenv_1.default.config();
const getGoogleAuthToken = async ({ code }) => {
    const url = 'https://oauth2.googleapis.com/token';
    const options = {
        code,
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_AUTH_CALLBACK,
        grant_type: 'authorization_code'
    };
    try {
        const response = await axios_1.default.post(url, qs_1.default.stringify(options), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        index_1.default.info('getGoogleAuthToken: Retrieved id_token');
        return response.data;
    }
    catch (error) {
        index_1.default.info(`Error: ${error}. Failed to get googleAuthToken`);
        throw new Error(error.message);
    }
};
exports.getGoogleAuthToken = getGoogleAuthToken;
//# sourceMappingURL=getGoogleAuthToken.js.map