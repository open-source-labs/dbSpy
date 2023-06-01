"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//-----IMPORTED FILES/MODULES
const react_1 = __importDefault(require("react"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
//-----MODAL for new row inputs
function RowInput({ tableName, currentTable, handleRowChange, secondaryColumnNames }) {
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    const { schemaStore } = (0, schemaStore_1.default)((state) => state);
    const arrOfDataType = schemaStore[tableName];
    const columns = [];
    const inputs = [];
    let columnNames;
    let maxConstraintNameLength;
    switch (dbCredentials.db_type) {
        case 'mysql':
            maxConstraintNameLength = 64;
        case 'mssql':
            maxConstraintNameLength = 128;
        case 'oracle':
            maxConstraintNameLength = 30;
        case 'sqlite':
            maxConstraintNameLength = 255;
        default:
            maxConstraintNameLength = 63; //Postgres
    }
    ;
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
        inputs.push(react_1.default.createElement("input", { key: i, className: 'm-2', type: "text", placeholder: arrOfDataType[columnNames[i]].data_type, maxLength: maxConstraintNameLength, onChange: (e) => {
                handleRowChange(i, e.target.value.trim());
            } }));
    }
    return (react_1.default.createElement("div", { className: "column-input" },
        react_1.default.createElement("div", null, columns),
        react_1.default.createElement("div", null, inputs)));
}
exports.default = RowInput;
//# sourceMappingURL=RowInput.js.map