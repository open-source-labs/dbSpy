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
const dataStore_1 = __importDefault(require("../../store/dataStore"));
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const RowInput_1 = __importDefault(require("./RowInput"));
//----- SENDING COLLECTED INPUTS FROM ROWINPUT.TSX TO BACKEND
function DataInputModal({ mode, closeDataInputModal, tableNameProp, }) {
    const [tableName] = (0, react_1.useState)(tableNameProp);
    const [rowData, setRowData] = (0, react_1.useState)([]);
    const [rowDataArr, setRowDataArr] = (0, react_1.useState)([]);
    const { schemaStore, setSchemaStore } = (0, schemaStore_1.default)((state) => state);
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    const { dataStore, setDataStore, addTableData } = (0, dataStore_1.default)((state) => state);
    //entire rows we currently have
    const deepCopyDataStore = JSON.parse(JSON.stringify(dataStore));
    const currentTable = deepCopyDataStore[tableName];
    // we get the column names from schemaStore IN CASE current table is EMPTY (because if table is EMPTY, it will
    // not pass in the column names) 
    const secondaryColumnNames = Object.keys(schemaStore[tableName]);
    const updatingDB = async (newRow) => {
        addTableData(tableName, newRow);
        //new column data that will be sent in the post request body
        const dataToSend = {
            tableName: tableName,
            newRow: newRow,
        };
        //adds new column to the selected table
        await fetch(`/api/sql/${dbCredentials.db_type}/addRow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
    };
    const handleSubmit = async () => {
        try {
            const additionalRow = {};
            // in case current table is EMPTY
            if (!currentTable.length) {
                secondaryColumnNames.forEach((columnName, i) => {
                    additionalRow[columnName] = rowData[i];
                });
            }
            else {
                // in case current table is NOT EMPTY
                Object.keys(currentTable[0]).forEach((columnName, i) => {
                    additionalRow[columnName] = rowData[i];
                });
            }
            currentTable.push(additionalRow);
            console.log('currentTable', currentTable);
            // send backend the new row ONLY to add this row to table we had
            await Promise.resolve(updatingDB(currentTable[currentTable.length - 1]));
        }
        catch (error) {
            window.alert(error);
            console.error(error);
        }
    };
    const handleRowChange = (index, value) => {
        //updating rowData (row of inputs for each column)
        setRowData((prevRows) => {
            prevRows[index] = value;
            return [...prevRows];
        });
    };
    return (react_1.default.createElement("div", { id: "inputModal", className: "input-modal" },
        react_1.default.createElement("form", { autoComplete: "off", onSubmit: (e) => {
                e.preventDefault();
                handleSubmit();
                closeDataInputModal();
            }, className: "modal-content rounded-md bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]" },
            react_1.default.createElement("div", { className: "table-name" }, react_1.default.createElement("h1", { className: "flex justify-center" }, `Table: ${tableName}`)),
            react_1.default.createElement("div", { className: "column-header" },
                react_1.default.createElement("h1", { className: "flex justify-center text-slate-900 dark:text-[#f8f4eb] flex-auto" }, 'New Row')),
            react_1.default.createElement(RowInput_1.default, { tableName: tableName, currentTable: currentTable, handleRowChange: handleRowChange, secondaryColumnNames: secondaryColumnNames }),
            react_1.default.createElement("div", { className: "mx-auto flex w-[50%] max-w-[200px] justify-between" },
                react_1.default.createElement("button", { type: "button", className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]", onClick: closeDataInputModal, "data-testid": "modal-cancel" }, "Cancel"),
                react_1.default.createElement("button", { className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]", "data-testid": "modal-submit" }, "Add Row")))));
}
exports.default = DataInputModal;
//# sourceMappingURL=DataInputModal.js.map