"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getCurrentUser = async (req, res) => {
    if (req?.session?.user) {
        const accessToken = req.session.user;
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_KEY, (_err, user) => {
            if (user.user)
                return user.user;
        });
        res.status(200).json(decoded);
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=session.service.js.map