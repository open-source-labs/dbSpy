"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// React & React Router Modules
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const react_router_dom_1 = require("react-router-dom");
const credentialsStore_1 = __importDefault(require("../store/credentialsStore"));
/* "Login" Component - login page for user login */
function Login() {
    //STATE DECLARATION (dbSpy3.0)
    const { setUser } = (0, credentialsStore_1.default)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [loginStatus, setLoginStatus] = (0, react_1.useState)(true);
    //END: STATE DECLARATION
    //Regular login using JWTs without OAuth
    const handleLogin = (e) => {
        e.preventDefault();
        const userLogin = {
            email: e.target.email.value,
            password: e.target.password.value,
        };
        axios_1.default
            .post('/api/verifyUser', userLogin)
            .then((res) => {
            setUser(res.data);
            navigate('/display');
        })
            .catch((err) => {
            setLoginStatus(false);
            for (const ele of document.getElementsByTagName('input')) {
                ele.style.border = 'solid 1px red';
            }
        });
    };
    return (react_1.default.createElement("div", { className: "mt-10 grid place-items-center" },
        react_1.default.createElement("h1", { className: "mt-10 text-3xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl" },
            react_1.default.createElement("span", { className: "bg-clip-text text-transparent text-sky-700" }, "Sign in"),
            " to your account"),
        react_1.default.createElement("div", { className: "mb-3 text-sm dark:text-white" },
            "Don't have an account yet?",
            ' ',
            react_1.default.createElement("span", { className: "font-semibold text-gray-400 hover:text-gray-300 active:text-gray-500" },
                react_1.default.createElement(react_router_dom_1.NavLink, { to: "/signup" }, "Sign up"))),
        react_1.default.createElement("div", { className: "" },
            react_1.default.createElement("form", { className: "w-full max-w-sm", onSubmit: (e) => handleLogin(e) },
                react_1.default.createElement("div", { className: "mb-6 md:flex md:items-center" },
                    react_1.default.createElement("div", { className: "md:w-1/3" },
                        react_1.default.createElement("label", { className: "mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right" }, "Email")),
                    react_1.default.createElement("div", { className: "md:w-2/3" },
                        react_1.default.createElement("input", { className: "err:focus:border-red-700 w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none", type: "email", id: "email", name: "email", placeholder: "example@email.com", required: true }))),
                react_1.default.createElement("div", { className: 'md:flex md:items-center ' + (loginStatus ? 'mb-6' : 'mb-2') },
                    react_1.default.createElement("div", { className: "md:w-1/3" },
                        react_1.default.createElement("label", { className: "mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right" }, "Password")),
                    react_1.default.createElement("div", { className: "md:w-2/3" },
                        react_1.default.createElement("input", { className: "w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none", type: "password", name: "password", id: "password", placeholder: "******************", required: true }))),
                loginStatus === false ? (react_1.default.createElement("p", { className: "mb-2 text-xs text-red-700 md:text-center" }, "Incorrect username/password")) : null,
                react_1.default.createElement("div", { className: "justify-center md:flex" },
                    react_1.default.createElement("button", { className: "focus:shadow-outline rounded bg-sky-700 py-2 px-4 font-bold text-white shadow hover:bg-indigo-400 focus:outline-none", type: "submit" }, "Sign In"))))));
}
exports.default = Login;
//# sourceMappingURL=Login.js.map