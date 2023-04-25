"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Navbar_1 = __importDefault(require("../components/Navbar"));
const credentialsStore_1 = __importDefault(require("../store/credentialsStore"));
function Shared() {
    //STATE DECLARATION (dbSpy3.0)
    const user = (0, credentialsStore_1.default)(state => state.user);
    const setUser = (0, credentialsStore_1.default)(state => state.setUser);
    //END: STATE DECLARATION
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Navbar_1.default, null),
        react_1.default.createElement(react_router_dom_1.Outlet, null)));
}
exports.default = Shared;
//# sourceMappingURL=Shared.js.map