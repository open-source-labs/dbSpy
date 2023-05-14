"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Home_1 = __importDefault(require("./pages/Home"));
const DBDisplay_1 = __importDefault(require("./pages/DBDisplay"));
const Login_1 = __importDefault(require("./pages/Login"));
const Signup_1 = __importDefault(require("./pages/Signup"));
const Shared_1 = __importDefault(require("./pages/Shared"));
const credentialsStore_1 = __importDefault(require("./store/credentialsStore"));
require("./styles/index.css");
const App = () => {
    //STATE DECLARATION (dbSpy3.0)
    const user = (0, credentialsStore_1.default)(state => state.user);
    //END: STATE DECLARATION
    /*
      React Router, a library for Client-Side Rendering, with 4 different paths:
      1. "/" - main launch page
      2. "/signup" - sign up page
      3. "/login" - login page
      4. "/display" | "/display/" - database visualization application page; only accessible when user is authorized;
      ** Reroutes either to home or display if signed in depending on
    */
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Routes, null,
            react_1.default.createElement(react_router_dom_1.Route, { path: '/', element: react_1.default.createElement(Shared_1.default, null) },
                react_1.default.createElement(react_router_dom_1.Route, { index: true, element: react_1.default.createElement(Home_1.default, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: 'login', element: user ? react_1.default.createElement(DBDisplay_1.default, null) : react_1.default.createElement(Login_1.default, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: 'signup', element: user ? react_1.default.createElement(DBDisplay_1.default, null) : react_1.default.createElement(Signup_1.default, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: 'display', element: react_1.default.createElement(DBDisplay_1.default, null) })))));
};
exports.default = App;
//# sourceMappingURL=App.js.map