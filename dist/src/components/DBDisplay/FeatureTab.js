"use strict";
// React & React Router & React Query Modules
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
const axios_1 = __importDefault(require("axios"));
// Functions imported:
const parse_1 = __importDefault(require("../../parse"));
// Stores imported:
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const flowStore_1 = __importDefault(require("../../store/flowStore"));
const settingsStore_1 = __importDefault(require("../../store/settingsStore"));
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
// Components imported:
const QueryModal_1 = __importDefault(require("../Modals/QueryModal"));
/** "FeatureTab" Component - a tab positioned in the left of the page to access features of the app; */
function FeatureTab(props) {
    //STATE DECLARATION (dbSpy3.0)
    const { setEdges, setNodes } = (0, flowStore_1.default)((state) => state);
    const { schemaStore, setSchemaStore, undoHandler, redoHandler } = (0, schemaStore_1.default)((state) => state);
    const { user, setUser } = (0, credentialsStore_1.default)((state) => state);
    const { setWelcome, isSchema } = (0, settingsStore_1.default)((state) => state);
    const [action, setAction] = (0, react_1.useState)(new Array());
    const [queryModalOpened, setQueryModalOpened] = (0, react_1.useState)(false);
    //END: STATE DECLARATION
    //create references for HTML elements
    const confirmModal = (0, react_1.useRef)();
    /* When the user clicks, open the modal */
    const openModal = (callback) => {
        confirmModal.current.style.display = 'block';
        confirmModal.current.style.zIndex = '100';
        setAction([callback]);
    };
    /* When the user clicks 'yes' or 'no', close it */
    const closeModal = (response) => {
        confirmModal.current.style.display = 'none';
        if (response)
            action[0]();
    };
    // HELPER FUNCTIONS
    const connectDb = () => {
        //if Flow is rendered, openModal
        if (document.querySelector('.flow'))
            openModal(props.handleSidebar);
        else
            props.handleSidebar();
    };
    const uploadSQL = () => {
        //if Flow is rendered, openModal
        if (document.querySelector('.flow'))
            openModal(getSchemaFromFile);
        else
            getSchemaFromFile();
    };
    const buildDb = () => {
        //if Flow is rendered, open modal
        if (document.querySelector('.flow'))
            openModal(buildDatabase);
        else
            buildDatabase();
    };
    const clearCanvas = () => {
        //if Flow is rendered, open modal
        if (document.querySelector('.flow'))
            openModal(clearCanvasTables);
        else
            clearCanvasTables();
    };
    const getSchemaFromFile = () => {
        // creating an input element for user to upload sql file
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event) => {
                //Parse the .sql file into a data structure that is same as "fetchedData" and store it into a variable named "parsedData"
                const parsedData = (0, parse_1.default)(event.target.result);
                setSchemaStore(parsedData);
                setWelcome(false);
            };
        };
    };
    const buildDatabase = () => {
        setNodes([]);
        setEdges([]);
        setWelcome(false);
    };
    const clearCanvasTables = () => {
        setSchemaStore({});
        setEdges([]);
        setNodes([]);
        setWelcome(false);
    };
    const openQueryModal = () => {
        setQueryModalOpened(true);
    };
    const closeQueryModal = () => {
        setQueryModalOpened(false);
    };
    // Temp
    const saveSchema = () => {
        if (!user)
            alert('Sign in first');
        else {
            const postBody = {
                email: user.email,
                schema: JSON.stringify(schemaStore),
            };
            axios_1.default.post('/api/saveSchema', postBody).catch((err) => console.error('err', err));
        }
    };
    const loadSchema = async () => {
        try {
            if (!user)
                return alert('Sign in first');
            const data = await fetch(`/api/retrieveSchema/${user.email}`);
            if (data.status === 204)
                return alert('No database stored!');
            const schemaString = await data.json();
            return setSchemaStore(JSON.parse(schemaString));
        }
        catch (err) {
            console.error('err retrieve', err);
        }
    };
    // Clears session + reset store
    const signoutSession = async () => {
        await fetch(`/api/logout`);
        window.open('/', '_self');
        setSchemaStore({});
        setUser(null);
    };
    // END: HELPER FUNCTIONS
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "mx-auto max-w-2xl" },
            react_1.default.createElement("aside", { className: "featureTab absolute inset-y-0 left-0 top-24 w-64", "aria-label": "FeatureTab" },
                react_1.default.createElement("div", { className: "menuBar overflow-y-auto rounded bg-[#f8f4eb] px-3 py-4 shadow-lg transition-colors duration-500 dark:bg-gray-800" },
                    react_1.default.createElement("p", { className: "text-slate-900 dark:text-[#f8f4eb]" }, "Action"),
                    react_1.default.createElement("hr", null),
                    react_1.default.createElement("ul", { className: "space-y-2" },
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: connectDb, className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700", "data-testid": "connect-database" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 h-6 w-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" })),
                                react_1.default.createElement("span", { className: "ml-3" }, "Connect Database"))),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: uploadSQL, className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Upload SQL File"),
                                react_1.default.createElement("span", { className: "ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300" }))),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: buildDb, className: " flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Build Database"))),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: openQueryModal, className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Export Query"))),
                        react_1.default.createElement("br", null),
                        react_1.default.createElement("p", { className: "text-slate-900 dark:text-[#f8f4eb]" }, "Edit"),
                        react_1.default.createElement("hr", null),
                        isSchema ? (react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: () => {
                                    props.openAddTableModal();
                                    // if schemaStore is empty, initialize
                                    if (!Object.keys(schemaStore).length)
                                        buildDatabase();
                                }, id: "addTable", className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Add Table")))) : null,
                        Object.keys(schemaStore).length ? (react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: () => {
                                    props.openDeleteTableModal();
                                }, id: "deleteTable", className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 16.875h3.375m0 0h3.375m-3.375 3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Delete Table")))) : (null),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: clearCanvas, className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Clear Canvas"))),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: undoHandler, className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Undo"))),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { onClick: redoHandler, className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" })),
                                react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Redo")))),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("div", { className: "historyBlock" },
                        react_1.default.createElement("p", { className: "text-slate-900 dark:text-[#f8f4eb]" }, "Account"),
                        react_1.default.createElement("hr", null),
                        react_1.default.createElement("ul", { className: "space-y-2" },
                            react_1.default.createElement("li", null,
                                react_1.default.createElement("a", { onClick: () => saveSchema(), className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                    react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                        react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
                                        react_1.default.createElement("polyline", { points: "17 21 17 13 7 13 7 21" }),
                                        ' ',
                                        react_1.default.createElement("polyline", { points: "7 3 7 8 15 8" })),
                                    react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Save Database"))),
                            react_1.default.createElement("li", null,
                                react_1.default.createElement("a", { onClick: () => loadSchema(), className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                    react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                        react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                                        react_1.default.createElement("polyline", { points: "17 8 12 3 7 8" }),
                                        react_1.default.createElement("line", { x1: "12", y1: "3", x2: "12", y2: "15" })),
                                    react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Load Database"))),
                            user ? (react_1.default.createElement("li", null,
                                react_1.default.createElement("a", { onClick: () => signoutSession(), className: "flex cursor-pointer items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700" },
                                    react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white" },
                                        react_1.default.createElement("path", { stroke: "none", d: "M0 0h24v24H0z" }),
                                        react_1.default.createElement("path", { d: "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" }),
                                        react_1.default.createElement("path", { d: "M7 12h14l-3 -3m0 6l3 -3" })),
                                    react_1.default.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, "Sign Out")))) : null)))),
            react_1.default.createElement("div", { ref: confirmModal, id: "confirmModal", className: "confirmModal" },
                react_1.default.createElement("div", { className: "modal-content w-[30%] min-w-[300px] max-w-[550px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]" },
                    react_1.default.createElement("p", { className: "mb-4 text-center text-slate-900 dark:text-[#f8f4eb]" },
                        "Are you sure you want to proceed? You will lose ",
                        react_1.default.createElement("strong", null, "ALL"),
                        " unsaved changes."),
                    react_1.default.createElement("div", { className: "mx-auto flex w-[50%] max-w-[200px] justify-between" },
                        react_1.default.createElement("button", { onClick: () => closeModal(true), className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]" }, "Confirm"),
                        react_1.default.createElement("button", { onClick: () => closeModal(false), className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]" }, "Cancel")))),
            queryModalOpened ? react_1.default.createElement(QueryModal_1.default, { closeQueryModal: closeQueryModal }) : null)));
}
exports.default = FeatureTab;
//# sourceMappingURL=FeatureTab.js.map