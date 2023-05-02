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
// React & React Router & React Query Modules;
const react_1 = __importStar(require("react"));
// Components Imported;
const Sidebar_1 = __importDefault(require("../components/DBDisplay/Sidebar"));
const FeatureTab_1 = __importDefault(require("../components/DBDisplay/FeatureTab"));
const AddReference_1 = __importDefault(require("../components/DBDisplay/AddReference"));
const Flow_1 = __importDefault(require("../components/ReactFlow/Flow"));
const DataFlow_1 = __importDefault(require("../components/ReactFlow/DataFlow"));
const InputModal_1 = __importDefault(require("../components/Modals/InputModal"));
const settingsStore_1 = __importDefault(require("../store/settingsStore"));
const DBDisplay = () => {
    const { sidebarDisplayState, welcome, editRefMode, inputModalState, setInputModalState, currentTable, isSchema, setTableMode } = (0, settingsStore_1.default)((state) => state);
    const openAddTableModal = () => setInputModalState(true, 'table');
    const openAddColumnModal = (tableName) => setInputModalState(true, 'column', tableName);
    //create references for HTML elements
    const mySideBarId = (0, react_1.useRef)();
    const mainId = (0, react_1.useRef)();
    /* Set the width of the side navigation to 250px and add a black background color to body */
    const openNav = () => {
        mySideBarId.current.style.width = '400px';
        mainId.current.style.marginRight = '400px';
    };
    /* Set the width of the side navigation to 0, and the background color of body to white */
    const closeNav = () => {
        mySideBarId.current.style.width = '0';
        mainId.current.style.marginRight = '50px';
    };
    /* Sidebar handler*/
    function handleSidebar() {
        if (sidebarDisplayState)
            closeNav();
        else
            openNav();
    }
    return (react_1.default.createElement("div", { id: "DBDisplay", className: "bg-[#f8f4eb] transition-colors duration-500 dark:bg-slate-700" },
        react_1.default.createElement("div", { ref: mySideBarId, id: "mySidenav", className: "sidenav bg-[#fbf3de] shadow-2xl dark:bg-slate-700" },
            react_1.default.createElement("a", { href: "#", className: "closebtn", onClick: closeNav }, "\u00D7"),
            react_1.default.createElement(Sidebar_1.default, { closeNav: closeNav }),
            editRefMode ? react_1.default.createElement(AddReference_1.default, null) : react_1.default.createElement(react_1.default.Fragment, null)),
        react_1.default.createElement(FeatureTab_1.default, { handleSidebar: handleSidebar, openAddTableModal: openAddTableModal }),
        react_1.default.createElement("div", { ref: mainId, id: "main", className: "mx-auto transition-colors duration-500" }, welcome ? (react_1.default.createElement("div", { className: "canvas-ConnectToDatabase relative right-[142px] m-auto flex w-[50%] flex-col transition-colors duration-500 dark:text-[#f8f4eb]" },
            react_1.default.createElement("h3", { className: "text-center" }, "Welcome to dbSpy!"),
            react_1.default.createElement("p", { className: "text-center" }, "Please connect your database, upload a SQL file, or build your database from scratch!"))) : (isSchema ? ( // if state for isSchema  === true
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("button", { id: "showSchema", className: "bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: setTableMode }, "Show data"),
            react_1.default.createElement(Flow_1.default, null))) : (
        //if false, we need data table
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("button", { id: "showSchema", className: "bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: setTableMode }, "Show Schema"),
            react_1.default.createElement(DataFlow_1.default, null))
        // <p>Data table</p>
        ))),
        inputModalState.isOpen && (react_1.default.createElement(InputModal_1.default, { mode: inputModalState.mode, tableNameProp: currentTable, closeInputModal: () => setInputModalState(false) }))));
};
exports.default = DBDisplay;
//# sourceMappingURL=DBDisplay.js.map