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
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const credentialsStore_1 = __importDefault(require("../store/credentialsStore"));
const newLogoWhite_png_1 = __importDefault(require("../assets/newLogoWhite.png"));
const right_to_bracket_solid_svg_1 = __importDefault(require("../assets/right-to-bracket-solid.svg"));
const default_pfp_svg_1 = __importDefault(require("../assets/default_pfp.svg"));
const linkbtn = 'mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4';
function Navbar() {
    //STATE DECLARATION (dbSpy3.0)
    const [theme, setTheme] = (0, react_1.useState)('Dark');
    const { user } = (0, credentialsStore_1.default)((state) => state);
    //END: STATE DECLARATION
    //this is a function to toggle class between light and dark using vanilla DOM manipulation and local state.
    //FOR FUTURE DEVS: there's probably a more elegant way to do this with settings store and sharing that state globally but tailwind cascades dark mode from the top element so this works
    const toggleClass = () => {
        const page = document.getElementById('body');
        page.classList.toggle('dark');
        theme === 'Dark' ? setTheme('Light') : setTheme('Dark');
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("nav", { className: "fixed top-0 flex w-full flex-wrap items-center justify-between bg-sky-800 p-6" },
            react_1.default.createElement("div", { className: "navItems text-base" },
                react_1.default.createElement("img", { className: "mr-5 inline-block h-[45] fill-current", src: newLogoWhite_png_1.default }),
                react_1.default.createElement(react_router_dom_1.NavLink, { to: "/", className: linkbtn }, "Home"),
                react_1.default.createElement(react_router_dom_1.NavLink, { to: "/display", "data-testid": "navbar-display", className: linkbtn }, "Display"),
                react_1.default.createElement("button", { className: "text-blue-200 hover:text-[#f8f4eb]", onClick: toggleClass },
                    theme,
                    " Mode")),
            react_1.default.createElement("div", null, user ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("span", { className: "mt-4 inline-block text-blue-200 lg:mt-0" }, user.full_name),
                react_1.default.createElement("img", { className: "ml-2 mr-2 inline-block h-[25] rounded-full invert", src: default_pfp_svg_1.default }))) : (react_1.default.createElement("div", null,
                react_1.default.createElement(react_router_dom_1.NavLink, { to: "/login", className: "mt-1 inline-block text-blue-200 shadow-2xl hover:text-white lg:mt-0" }, "Login"),
                react_1.default.createElement("img", { className: "mr-3 ml-3 inline-block h-[20] invert", src: right_to_bracket_solid_svg_1.default }))))),
        react_1.default.createElement("div", { className: "h-[64px]" })));
}
exports.default = Navbar;
//# sourceMappingURL=Navbar.js.map