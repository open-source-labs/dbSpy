"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOAuthLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const handleOAuthLogin = async () => {
    const res = await axios_1.default.get('/api/googleAuthUrl');
    const url = JSON.parse(res.data);
    const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    window.open(url, '_self', strWindowFeatures);
};
exports.handleOAuthLogin = handleOAuthLogin;
//# sourceMappingURL=getGoogleUrl.js.map