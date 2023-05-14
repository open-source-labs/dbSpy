"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//-----IMPORTED FILES/MODULES
const react_1 = __importDefault(require("react"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
//-----MODAL for new row inputs
function RowInput({ tableName, currentTable, handleRowChange, secondaryColumnNames }) {
    const { schemaStore } = (0, schemaStore_1.default)((state) => state);
    const arrOfDataType = schemaStore["public." + tableName];
    const columns = [];
    const inputs = [];
    let columnNames;
    // If current table is EMPTY, we are going to use secondaryColumnNames we got from schemaStore in DataInputModal 
    if (!currentTable.length) {
        columnNames = secondaryColumnNames;
    }
    else {
        columnNames = Object.keys(currentTable[0]);
    }
    columnNames.forEach((each, i) => {
        columns.push(react_1.default.createElement("label", { key: i + each, className: " m-2 text-center text-slate-900 dark:text-[#f8f4eb]" }, each));
    });
    for (let i = 0; i < columns.length; i++) {
        inputs.push(react_1.default.createElement("input", { key: i + columns[i], className: 'm-2', type: "text", placeholder: arrOfDataType[columnNames[i]].data_type, maxLength: 63, onChange: (e) => {
                handleRowChange(i, e.target.value.trim());
            } }));
    }
    return (react_1.default.createElement("div", { className: "column-input" },
        react_1.default.createElement("div", null, columns),
        react_1.default.createElement("div", null, inputs)));
}
exports.default = RowInput;
//# sourceMappingURL=RowInput.js.map