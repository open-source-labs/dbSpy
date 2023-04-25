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
const axios_1 = __importDefault(require("axios"));
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
/* "Signup" Component - signup page for user creation */
function Signup() {
    const [emailErr, setEmailErr] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    //Regular login using JWTs without OAuth
    const registerAccount = async (e) => {
        e.preventDefault();
        // TODO: What's the proper type? HTLMFormElement ? HTMLInputElement?
        let formValues = e.target;
        const email = formValues[0].value;
        const full_name = `${formValues[1].value} ${formValues[2].value}`;
        const password = formValues[3].value;
        await axios_1.default
            .post('/api/userRegistration', { full_name, email, password })
            .then(() => navigate('/login'))
            .catch((err) => {
            const emailInput = document.querySelector('#email');
            setEmailErr(true);
            emailInput.focus();
        });
    };
    return (react_1.default.createElement("div", { className: "mt-10 grid place-items-center dark:text-white" },
        react_1.default.createElement("h1", { className: "mt-10 text-3xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl" },
            react_1.default.createElement("span", { className: "bg-clip-text text-transparent text-sky-700" }, "Sign up"),
            " with dbSpy"),
        react_1.default.createElement("div", { className: "mb-3 text-sm" },
            "Already have an account? Login",
            ' ',
            react_1.default.createElement("span", { className: "font-semibold text-gray-400 hover:text-gray-300 active:text-gray-500" },
                react_1.default.createElement(react_router_dom_1.NavLink, { to: "/login" }, "here"))),
        react_1.default.createElement("div", { className: "" },
            react_1.default.createElement("form", { className: "w-full max-w-sm", onSubmit: (e) => registerAccount(e) },
                react_1.default.createElement("div", { className: "mb-6 md:flex md:items-center" },
                    react_1.default.createElement("div", { className: "md:w-1/3" },
                        react_1.default.createElement("label", { className: "mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right" }, "Email")),
                    react_1.default.createElement("div", { className: "md:w-2/3" },
                        react_1.default.createElement("input", { className: 'w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:bg-white focus:outline-none ' +
                                (!emailErr ? 'focus:border-indigo-500' : 'focus:border-red-700'), type: "email", id: "email", name: "email", placeholder: "example@email.com", required: true }),
                        emailErr ? (react_1.default.createElement("div", { className: "absolute ml-3 text-xs text-red-700 md:text-right" }, "Email address is already in use")) : null)),
                react_1.default.createElement("div", { className: "mb-6 md:flex md:items-center" },
                    react_1.default.createElement("div", { className: "md:w-1/3" },
                        react_1.default.createElement("label", { className: "mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right" }, "First Name")),
                    react_1.default.createElement("div", { className: "md:w-2/3" },
                        react_1.default.createElement("input", { className: "w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none", type: "text", id: "firstName", placeholder: "Jane", name: "firstName", required: true }))),
                react_1.default.createElement("div", { className: "mb-6 md:flex md:items-center" },
                    react_1.default.createElement("div", { className: "md:w-1/3" },
                        react_1.default.createElement("label", { className: "mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right" }, "Last Name")),
                    react_1.default.createElement("div", { className: "md:w-2/3" },
                        react_1.default.createElement("input", { className: "w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none", type: "text", id: "lastName", placeholder: "Doe", name: "lastName", required: true }))),
                react_1.default.createElement("div", { className: "mb-6 md:flex md:items-center" },
                    react_1.default.createElement("div", { className: "md:w-1/3" },
                        react_1.default.createElement("label", { className: "mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right" }, "Password")),
                    react_1.default.createElement("div", { className: "md:w-2/3" },
                        react_1.default.createElement("input", { className: "w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none", type: "password", name: "password", id: "password", placeholder: "******************", required: true }))),
                react_1.default.createElement("div", { className: "justify-center md:flex" },
                    react_1.default.createElement("button", { className: "focus:shadow-outline rounded bg-sky-700 py-2 px-4 font-bold text-white shadow hover:bg-indigo-400 focus:outline-none", type: "submit" }, "Sign Up"))))));
}
exports.default = Signup;
//# sourceMappingURL=Signup.js.map