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
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    const { setSchemaStore } = (0, schemaStore_1.default)((state) => state);
    const { setDataStore } = (0, dataStore_1.default)((state) => state);
    (0, react_1.useEffect)(() => {
        const fetchTableNames = async () => {
            try {
                const response = await fetch(`/api/sql/${dbCredentials.db_type}/tableNames`);
                const data = await response.json();
                setTableNames(data);
            }
            catch (error) {
                console.error('Error fetching table names:', error);
            }
            ;
        };
        fetchTableNames();
    }, []);
    const handleDelete = async () => {
        const deleteTable = async () => {
            await fetch(`/api/sql/${dbCredentials.db_type}/deleteTable`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableName: tableName })
            })
                .then(resetData => resetData.json())
                //   deleteTableSchema(tableName);
                //   deleteTableData(tableName);
                .then(resetData => {
                setSchemaStore(Object.keys(resetData.schema).length >= 1 ? resetData.schema : {});
                setDataStore(Object.keys(resetData.data).length >= 1 ? resetData.data : {});
            })
                .then(() => {
                setTableName('');
            })
                .then(() => {
                closeDeleteTableModal();
            })
                .catch((error) => {
                closeDeleteTableModal();
                setTableName('');
                console.error('Error fetching table names:', error);
            });
        };
        await deleteTable();
    };
    return (react_1.default.createElement("div", { id: "deleteTableModal", className: "input-modal" },
        react_1.default.createElement("div", { className: "modal-content rounded-md bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b] w-96" },
            react_1.default.createElement("h2", { className: "text-slate-900 dark:text-[#f8f4eb] text-xl pb-4" }, "Select a table to delete:"),
            react_1.default.createElement("ul", { className: "text-slate-900 dark:text-[#f8f4eb]" }, tableNames.map((name) => (react_1.default.createElement("li", { key: `table-${name}`, className: "flex items-center justify-between pb-2" },
                name,
                ' ',
                react_1.default.createElement("button", { onClick: () => setTableName(name), className: "bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" }, "Delete"))))),
            tableName && (react_1.default.createElement("div", { className: "mt-4 text-slate-900 dark:text-[#f8f4eb]" },
                react_1.default.createElement("br", null),
                react_1.default.createElement("h3", { className: "mb-2 flex justify-center" },
                    "Are you sure you want to delete the ",
                    tableName,
                    " table?"),
                react_1.default.createElement("div", { className: "flex gap-4 justify-center" },
                    react_1.default.createElement("button", { onClick: async (e) => {
                            e.preventDefault();
                            await handleDelete();
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
                    }, "data-testid": "modal-cancel" }, "Cancel")))));
}
exports.default = DeleteTableModal;
;
//# sourceMappingURL=DeleteTableModal.js.map