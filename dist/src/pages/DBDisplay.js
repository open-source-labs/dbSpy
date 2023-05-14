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
const DataInputModal_1 = __importDefault(require("../components/Modals/DataInputModal"));
const DeleteTableModal_1 = __importDefault(require("../components/Modals/DeleteTableModal"));
const credentialsStore_1 = __importDefault(require("../store/credentialsStore"));
const settingsStore_1 = __importDefault(require("../store/settingsStore"));
const DBDisplay = () => {
    const { setUser } = (0, credentialsStore_1.default)();
    const { sidebarDisplayState, welcome, editRefMode, inputModalState, setInputModalState, deleteTableModalState, setDeleteTableModalState, currentTable, isSchema, setTableMode } = (0, settingsStore_1.default)((state) => state);
    const openAddTableModal = () => setInputModalState(true, 'table');
    const openDeleteTableModal = () => setDeleteTableModalState(true);
    const openAddColumnModal = (tableName) => setInputModalState(true, 'column', tableName);
    const openAddRowModal = (tableName) => setInputModalState(true, 'row', tableName); //(isOpen? mode? currentTable?)
    //create references for HTML elements
    const mySideBarId = (0, react_1.useRef)();
    const mainId = (0, react_1.useRef)();
    ////////////OAUTHHHHHHHH//////////////////
    (0, react_1.useEffect)(() => {
        const windowUrl = window.location.search;
        const urlParams = new URLSearchParams(windowUrl);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        if (code) {
            fetch('/api/oauth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/JSON'
                },
                body: JSON.stringify({ code: code, state: state }),
            })
                .then((data) => {
                if (data.status === 200)
                    console.log(`OAuth : successfully sent authorization code back ${data.status}`);
                else
                    console.log(`OAUTH: error sending authorization code back ${data.status}`);
                return data.json();
            })
                .then((res) => {
                console.log(res);
                setUser(res);
            })
                .catch((err) => {
                console.log({
                    log: `error Post request to backend from DBdisplay ${err}`,
                    status: err,
                    message: `error occured logging in`
                });
            });
        }
    }, []);
    //TODO: Hide add table on dataview click
    // const dataOnclick = ():void => {
    //   const addTableButtonRef = useRef(null);
    // }
    //////////////OAUTHHHHHHH//////////////
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
    //console.log('isSchema???', isSchema)
    //console.log('currentTable???', currentTable)
    return (react_1.default.createElement("div", { id: "DBDisplay", className: "bg-[#f8f4eb] transition-colors duration-500 dark:bg-slate-700" },
        react_1.default.createElement("div", { ref: mySideBarId, id: "mySidenav", className: "sidenav bg-[#fbf3de] shadow-2xl dark:bg-slate-700" },
            react_1.default.createElement("a", { href: "#", className: "closebtn", onClick: closeNav }, "\u00D7"),
            react_1.default.createElement(Sidebar_1.default, { closeNav: closeNav }),
            editRefMode ? react_1.default.createElement(AddReference_1.default, null) : react_1.default.createElement(react_1.default.Fragment, null)),
        react_1.default.createElement(FeatureTab_1.default, { handleSidebar: handleSidebar, openAddTableModal: openAddTableModal, openDeleteTableModal: openDeleteTableModal }),
        react_1.default.createElement("div", { ref: mainId, id: "main", className: "mx-auto transition-colors duration-500" }, welcome ? (react_1.default.createElement("div", { className: "canvas-ConnectToDatabase relative right-[142px] m-auto flex w-[50%] flex-col transition-colors duration-500 dark:text-[#f8f4eb]" },
            react_1.default.createElement("h3", { className: "text-center" }, "Welcome to dbSpy!"),
            react_1.default.createElement("p", { className: "text-center" }, "Please connect your database, upload a SQL file, or build your database from scratch!"))) : (
        // if true, show schema table
        isSchema ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("button", { id: "showSchema", className: "bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: setTableMode }, "Show data"),
            react_1.default.createElement(Flow_1.default, null))) : (
        //if false, show data table
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("button", { id: "showSchema", className: "bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: setTableMode }, "Show Schema"),
            react_1.default.createElement(DataFlow_1.default, null))))),
        inputModalState.isOpen ? (isSchema ? (react_1.default.createElement(InputModal_1.default, { mode: inputModalState.mode, tableNameProp: currentTable, closeInputModal: () => setInputModalState(false) })) : (react_1.default.createElement(DataInputModal_1.default
        //mode={inputModalState.mode}
        , { 
            //mode={inputModalState.mode}
            tableNameProp: currentTable, closeInputModal: () => setInputModalState(false) }))) : null,
        deleteTableModalState.isOpen ?
            react_1.default.createElement(DeleteTableModal_1.default, { closeDeleteTableModal: () => setDeleteTableModalState(false) })
            : null));
};
exports.default = DBDisplay;
//# sourceMappingURL=DBDisplay.js.map