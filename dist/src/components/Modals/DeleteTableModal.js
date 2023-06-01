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
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
const dataStore_1 = __importDefault(require("../../store/dataStore"));
function DeleteTableModal({ closeDeleteTableModal, }) {
    const [tableName, setTableName] = (0, react_1.useState)('');
    const [tableNames, setTableNames] = (0, react_1.useState)([]);
    const [connectPressed, setConnectPressed] = (0, react_1.useState)(false);
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    const { schemaStore, setSchemaStore } = (0, schemaStore_1.default)((state) => state);
    const { dataStore, setDataStore } = (0, dataStore_1.default)((state) => state);
    (0, react_1.useEffect)(() => {
        const fetchTableNames = async () => {
            try {
                const tableNameArr = [];
                for (const tableName in schemaStore) {
                    tableNameArr.push(tableName);
                }
                ;
                setTableNames(tableNameArr);
            }
            catch (error) {
                console.error('Error retrieving table names from schemaStore:', error);
            }
            ;
        };
        fetchTableNames();
    }, []);
    const deleteTable = async () => {
        setConnectPressed(true);
        await fetch(`/api/sql/${dbCredentials.db_type}/deleteTable`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tableName: tableName })
        })
            .then(() => {
            delete schemaStore[tableName];
            delete dataStore[tableName];
        })
            .then(() => {
            setSchemaStore(Object.keys(schemaStore).length > 0 ? { ...schemaStore } : {});
            setDataStore(Object.keys(dataStore).length > 0 ? { ...dataStore } : {});
        })
            .then(() => {
            setTableName('');
            setConnectPressed(false);
            closeDeleteTableModal();
        })
            .catch((error) => {
            console.log('dataStore.tableName: ', dataStore.tableName, 'schemaStore.tableName: ', schemaStore.tableName);
            closeDeleteTableModal();
            setTableName('');
            console.error('Error fetching table names:', error);
        });
    };
    return (react_1.default.createElement("div", { id: "deleteTableModal", className: "input-modal" },
        react_1.default.createElement("div", { className: "modal-content rounded-md bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b] w-96" },
            react_1.default.createElement("h2", { className: "text-slate-900 dark:text-[#f8f4eb] text-xl pb-4" }, "Select a table to delete:"),
            react_1.default.createElement("ul", { className: "text-slate-900 dark:text-[#f8f4eb]" }, tableNames.map((name) => (react_1.default.createElement("li", { key: `table-${name}`, className: "flex items-center justify-between pb-2" },
                name,
                ' ',
                react_1.default.createElement("button", { value: name, onClick: () => setTableName(name), className: "bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" }, "Delete"))))),
            !connectPressed ? (react_1.default.createElement(react_1.default.Fragment, null,
                tableName && (react_1.default.createElement("div", { className: "mt-4 text-slate-900 dark:text-[#f8f4eb]" },
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("h3", { className: "mb-2 flex justify-center" },
                        "Are you sure you want to delete the ",
                        tableName,
                        " table?"),
                    react_1.default.createElement("div", { className: "flex gap-4 justify-center" },
                        react_1.default.createElement("button", { onClick: async (e) => {
                                e.preventDefault();
                                await deleteTable();
                                setTableName('');
                            }, className: "text-white bg-red-500 dark:text-[#f8f4eb] rounded-md px-2 py-1 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 border-2 border-red-400" }, "Confirm"),
                        ' ',
                        react_1.default.createElement("button", { onClick: () => setTableName(''), className: "text-slate-900 dark:text-[#f8f4eb] rounded-md px-2 py-1 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 border-2 border-slate-500" }, "Return")))),
                react_1.default.createElement("br", null),
                react_1.default.createElement("div", { className: "flex justify-center" },
                    react_1.default.createElement("button", { type: "button", className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb] ", onClick: async (e) => {
                            e.preventDefault();
                            setTableNames([]);
                            setTableName('');
                            closeDeleteTableModal();
                        }, "data-testid": "modal-cancel" }, "Cancel")))) : (react_1.default.createElement("div", { className: "flex items-center justify-center" },
                react_1.default.createElement("br", null),
                react_1.default.createElement("div", { className: "flex items-center justify-center space-x-1 dark:text-[#f8f4eb]" },
                    react_1.default.createElement("svg", { fill: "none", className: "h-6 w-6 animate-spin", viewBox: "0 0 32 32", xmlns: "http://www.w3.org/2000/svg" },
                        react_1.default.createElement("path", { clipRule: "evenodd", d: "M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z", fill: "currentColor", fillRule: "evenodd" })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null, "Deleting..."),
                        react_1.default.createElement("p", null, "Please wait, this could take a minute"))))))));
}
exports.default = DeleteTableModal;
;
//# sourceMappingURL=DeleteTableModal.js.map