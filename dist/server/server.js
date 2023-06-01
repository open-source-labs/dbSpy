"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./logger/index"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
app.use((0, express_session_1.default)({
    secret: Math.floor(Math.random() * 1000000).toString(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
        httpOnly: true,
        path: '/',
        sameSite: true,
        expires: undefined
    },
}));
app.listen(3000, () => {
    index_1.default.info(`Securely Running at ${port}`);
    (0, routes_1.default)(app);
});
exports.default = app;
//# sourceMappingURL=server.js.map