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
const react_router_dom_1 = require("react-router-dom");
const axios_1 = __importDefault(require("axios"));
//Components imported
const Contributors_1 = __importDefault(require("../components/Home/Contributors"));
const credentialsStore_1 = __importDefault(require("../store/credentialsStore"));
const ScreenshotDemo_png_1 = __importDefault(require("../assets/ScreenshotDemo.png"));
// const server_url = process.env.NODE_ENV === 'dev' ? process.env.DEV_SERVER_ENDPOINT : process.env.SERVER_ENDPOINT
/* "Home" Component - main launch page */
function Home() {
    const user = (0, credentialsStore_1.default)((state) => state.user);
    const setUser = (0, credentialsStore_1.default)((state) => state.setUser);
    //END: STATE DECLARATION
    /* Retrieve user data from server*/
    (0, react_1.useEffect)(() => {
        const getUserData = async () => {
            const response = await (0, axios_1.default)(`/api/me`, {
                withCredentials: true,
            });
            setUser(response.data);
            return response.data;
        };
        getUserData();
        window.history.replaceState({}, document.title, '/');
    }, []);
    return (react_1.default.createElement("div", { className: "" },
        react_1.default.createElement("div", { className: "container mx-auto px-6 md:px-12 xl:px-32" },
            react_1.default.createElement("div", { className: "text-center text-gray-800 dark:text-[#f8f4eb]" },
                react_1.default.createElement("div", { className: "heroCard block rounded-lg bg-[#f8f4eb] px-6 py-12 shadow-lg dark:bg-slate-900 md:py-16 md:px-12" },
                    react_1.default.createElement("h1", { className: "mb-12 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl" },
                        "Database development ",
                        react_1.default.createElement("br", null),
                        react_1.default.createElement("span", { className: "text-blue-600" }, "simplified.")),
                    react_1.default.createElement("br", null),
                    user ? (react_1.default.createElement("div", { className: "text-3xl font-bold" },
                        "Welcome back, ",
                        user.full_name.includes(' ') ? user.full_name.slice(0, user.full_name.indexOf(' ')) : user.full_name,
                        "!")) : (react_1.default.createElement(react_router_dom_1.NavLink, { to: "/display", className: "mb-2 mr-0 inline-block rounded bg-blue-600 px-7 py-3 text-sm font-medium uppercase leading-snug text-[#f8f4eb] shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg md:mb-0 md:mr-2", "data-mdb-ripple": "true", "data-mdb-ripple-color": "light", role: "button" }, "Get Started"))))),
        react_1.default.createElement("br", null),
        react_1.default.createElement("section", { className: "container mx-auto px-6 md:px-12 xl:px-32 " },
            react_1.default.createElement("div", { className: "descriptionCard block rounded-lg bg-[#f8f4eb] shadow-lg dark:bg-slate-900 dark:text-[#f8f4eb]" },
                react_1.default.createElement("div", { className: "flex flex-wrap items-center" },
                    react_1.default.createElement("div", { className: "block w-full shrink-0 grow-0 basis-auto lg:flex lg:w-6/12 xl:w-4/12" },
                        react_1.default.createElement("img", { src: ScreenshotDemo_png_1.default, className: "descriptionImg mx-8 my-8 w-11/12 rounded-lg lg:rounded-bl-lg" })),
                    react_1.default.createElement("div", { className: "w-full shrink-0 grow-0 basis-auto lg:w-6/12 xl:w-8/12" },
                        react_1.default.createElement("div", { className: "px-6 py-12 md:px-12" },
                            react_1.default.createElement("h2", { className: "mb-6 text-3xl font-bold dark:text-[#f8f4eb]" }, "Key Features"),
                            react_1.default.createElement("p", { className: "mb-6 text-gray-500 dark:text-[#f8f4eb]" },
                                "dbSpy is an",
                                ' ',
                                react_1.default.createElement("a", { className: "text-blue-600", href: "https://github.com/open-source-labs/dbSpy" }, "open-source tool"),
                                ' ',
                                "to facilitate relational database development.",
                                react_1.default.createElement("br", null),
                                " Visualize, modify, and build your various SQL databases, all in one place."),
                            react_1.default.createElement("div", { className: "grid gap-x-6 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3" },
                                react_1.default.createElement("div", { className: "mb-6" },
                                    react_1.default.createElement("p", { className: "flex items-center text-gray-900 dark:text-[#f8f4eb]" },
                                        react_1.default.createElement("svg", { className: "mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                                            react_1.default.createElement("path", { fill: "currentColor", d: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" })),
                                        "Database Connection")),
                                react_1.default.createElement("div", { className: "mb-6" },
                                    react_1.default.createElement("p", { className: "flex items-center text-gray-900 dark:text-[#f8f4eb]" },
                                        react_1.default.createElement("svg", { className: "mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                                            react_1.default.createElement("path", { fill: "currentColor", d: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" })),
                                        "Schema & Data Modification")),
                                react_1.default.createElement("div", { className: "mb-6" },
                                    react_1.default.createElement("p", { className: "flex items-center text-gray-900 dark:text-[#f8f4eb]" },
                                        react_1.default.createElement("svg", { className: "mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                                            react_1.default.createElement("path", { fill: "currentColor", d: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" })),
                                        "SQL Query Export")),
                                react_1.default.createElement("div", { className: "mb-6" },
                                    react_1.default.createElement("p", { className: "flex items-center text-gray-900 dark:text-[#f8f4eb]" },
                                        react_1.default.createElement("svg", { className: "mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                                            react_1.default.createElement("path", { fill: "currentColor", d: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" })),
                                        "ER Diagrams")),
                                react_1.default.createElement("div", { className: "mb-6" },
                                    react_1.default.createElement("p", { className: "flex items-center text-gray-900 dark:text-[#f8f4eb]" },
                                        react_1.default.createElement("svg", { className: "mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                                            react_1.default.createElement("path", { fill: "currentColor", d: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" })),
                                        "Screenshot Support")),
                                react_1.default.createElement("div", { className: "mb-6" },
                                    react_1.default.createElement("p", { className: "flex items-center text-gray-900 dark:text-[#f8f4eb]" },
                                        react_1.default.createElement("svg", { className: "mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                                            react_1.default.createElement("path", { fill: "currentColor", d: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" })),
                                        "User Sessions")))))))),
        react_1.default.createElement(Contributors_1.default, null),
        react_1.default.createElement("footer", { className: "bg-gray-200 text-center dark:bg-slate-800 lg:text-left" },
            react_1.default.createElement("div", { className: "p-4 text-center text-gray-700 dark:text-[#f8f4eb]" }, "Copyright \u00A9 2022 dbSpy + OSLabs. Distributed under the MIT License."))));
}
exports.default = Home;
//# sourceMappingURL=Home.js.map