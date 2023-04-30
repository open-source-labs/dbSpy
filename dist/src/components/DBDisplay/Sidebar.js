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
const axios_1 = __importDefault(require("axios"));
// Components Imported;
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const settingsStore_1 = __importDefault(require("../../store/settingsStore"));
const dataStore_1 = __importDefault(require("../../store/dataStore"));
// const server_url = process.env.NODE_ENV === 'dev' ? process.env.DEV_SERVER_ENDPOINT : process.env.SERVER_ENDPOINT
const Sidebar = (props) => {
    //STATE DECLARATION (dbSpy3.0)
    const setDbCredentials = (0, credentialsStore_1.default)((state) => state.setDbCredentials);
    const setSchemaStore = (0, schemaStore_1.default)((state) => state.setSchemaStore);
    const setDataStore = (0, dataStore_1.default)((state) => state.setDataStore);
    const { setWelcome } = (0, settingsStore_1.default)((state) => state);
    //used to signal whether loading indicator should appear on sidebar or not, if connect button is pressed
    const [connectPressed, setConnectPressed] = (0, react_1.useState)(false);
    //used to signal whether full database url input should display in form
    const [_selected, setSelected] = (0, react_1.useState)('postgres');
    //form state hooks
    const [formValues, setFormValues] = (0, react_1.useState)({ db_type: 'postgres' });
    //END: STATE DECLARATION
    //HELPER FUNCTIONS
    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = formValues;
        //parsing postgres database URL defers from parsing mySQL database URL
        if (values.database_link) {
            const fullLink = values.database_link;
            const splitURI = fullLink.split('/');
            if (splitURI[0] === 'postgres:') {
                const name = splitURI[3];
                const internalLinkArray = splitURI[2].split(':')[1].split('@');
                values.hostname = internalLinkArray[1];
                values.username = name;
                values.password = internalLinkArray[0];
                values.port = '5432';
                values.database_name = name;
                values.db_type = 'postgres';
            }
            else if (splitURI[0] === 'mysql:') {
                const name_mySQL = splitURI[3].split('?');
                const internalLinkArray_mySQL = splitURI[2].split(':')[1].split('@');
                values.hostname = internalLinkArray_mySQL[1];
                values.username = splitURI[2].split(':')[0];
                values.password = internalLinkArray_mySQL[0];
                values.port = '3306';
                values.database_name = name_mySQL[0];
                values.db_type = 'mysql';
            }
        }
        console.log('values: ', values);
        //update dbCredentials
        setDbCredentials(values);
        setConnectPressed(true);
        //change between which getSchema from MySQL to postgres based on db_type
        const dataFromBackend = await axios_1.default
            .get(`api/sql/${values.db_type}/schema`, { params: values })
            .then((res) => {
            console.log('res.data', res.data);
            return res.data;
        })
            .catch((err) => console.error('getSchema error', err));
        //update schemaStore
        console.log('schemaFromBackend', dataFromBackend.schema);
        console.log('dataFromBackend', dataFromBackend.data);
        setSchemaStore(dataFromBackend.schema);
        setDataStore(dataFromBackend.data);
        setWelcome(false);
        setConnectPressed(false);
        props.closeNav();
    };
    //on change for db type selection, will affect state to conditionally render database URL
    const handleChange = (event) => {
        setSelected(event.target.value);
    };
    //END: HELPER FUNCTIONS
    return (react_1.default.createElement("form", { id: "dbconnect", className: "bg-[#fbf3de] dark:bg-slate-700" },
        react_1.default.createElement("label", { className: "dark:text-[#f8f4eb]" },
            react_1.default.createElement("h3", null, "Connect to Database")),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "db_type", className: "dark:text-white" }, "Database Type"),
            react_1.default.createElement("select", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", id: "db_type", name: "db_type", onChange: (e) => {
                    setFormValues({ ...formValues, db_type: e.target.value });
                    handleChange(e);
                } },
                react_1.default.createElement("option", { value: "postgres" }, "PostgreSQL"),
                react_1.default.createElement("option", { value: "mysql" }, "MySQL"),
                react_1.default.createElement("option", { value: "mssql" }, "Microsoft SQL"))),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", null,
            react_1.default.createElement("span", { className: "form-item" },
                react_1.default.createElement("label", { htmlFor: "database_link", className: "dark:text-[#f8f4eb]" }, "Full Database Link"),
                react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", id: "database_link ", name: "database_link", autoComplete: "off", onChange: (e) => setFormValues({ ...formValues, database_link: e.target.value }) })),
            react_1.default.createElement("br", null),
            react_1.default.createElement("div", { className: "form-item dark:text-[#f8f4eb]" },
                react_1.default.createElement("p", { className: "" }, "OR")),
            react_1.default.createElement("br", null)),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "hostname", className: "dark:text-[#f8f4eb]" }, "Host"),
            react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", id: "hostname", name: "hostname", autoComplete: "off", onChange: (e) => setFormValues({ ...formValues, hostname: e.target.value }) })),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "port", className: "dark:text-[#f8f4eb]" }, "Port"),
            react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", id: "port", name: "port", autoComplete: "off", onChange: (e) => setFormValues({ ...formValues, port: e.target.value }) })),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "username", className: "dark:text-[#f8f4eb]" }, "Database Username"),
            react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", id: "username", name: "username", autoComplete: "off", onChange: (e) => setFormValues({ ...formValues, username: e.target.value }) })),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "password", className: "dark:text-[#f8f4eb]" }, "Database Password"),
            react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", id: "password", name: "password", autoComplete: "off", onChange: (e) => setFormValues({ ...formValues, password: e.target.value }) })),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "database_name", className: "dark:text-[#f8f4eb]" }, "Database Name"),
            react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", id: "database_name ", name: "database_name", autoComplete: "off", onChange: (e) => setFormValues({ ...formValues, database_name: e.target.value }) })),
        react_1.default.createElement("br", null),
        react_1.default.createElement("button", { className: "form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:opacity-80 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg", id: "submit", onClick: (e) => handleSubmit(e) }, "Connect"),
        react_1.default.createElement("br", null),
        !connectPressed ? (react_1.default.createElement("div", { className: "h-[58px]" })) : (react_1.default.createElement("div", { className: "flex h-full w-full items-center justify-center" },
            react_1.default.createElement("div", { className: "flex items-center justify-center space-x-1 dark:text-[#f8f4eb]" },
                react_1.default.createElement("svg", { fill: "none", className: "h-6 w-6 animate-spin", viewBox: "0 0 32 32", xmlns: "http://www.w3.org/2000/svg" },
                    react_1.default.createElement("path", { clipRule: "evenodd", d: "M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z", fill: "currentColor", fillRule: "evenodd" })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("p", null, "Loading..."),
                    react_1.default.createElement("p", null, "Please wait, this could take a minute")))))));
};
exports.default = Sidebar;
//# sourceMappingURL=Sidebar.js.map