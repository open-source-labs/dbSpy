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
const ColumnInput_1 = __importDefault(require("./ColumnInput"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
// TODO: ADD FORM VALIDATION
// table or column name can have length <= 63
function InputModal({ mode, closeInputModal, tableNameProp, }) {
    // TODO: separate state for table name and column data
    // TODO: FORCE USER TO CHOOSE ONE AND ONLY ONE COLUMN AS PK WHEN CREATING TABLE
    // AFTERWARDS, PK MAY NOT BE EDITED
    const initialTable = 'untitled_table';
    const initialColumns = [
        {
            name: 'id',
            type: 'AUTO_INCREMENT',
            isNullable: false,
            isPrimary: true,
            defaultValue: null,
        },
        {
            name: 'created_at',
            type: 'TIMESTAMP',
            isNullable: false,
            isPrimary: false,
            defaultValue: 'NOW()',
        },
    ];
    const additionalColumn = [
        {
            name: 'column_1',
            type: 'VARCHAR(255)',
            isNullable: false,
            isPrimary: false,
            defaultValue: null,
        },
    ];
    const [tableName, setTableName] = (0, react_1.useState)(() => {
        if (!tableNameProp)
            return initialTable;
        else
            return tableNameProp;
    });
    const [columnData, setColumnData] = (0, react_1.useState)(() => {
        if (mode === 'table')
            return initialColumns;
        else
            return additionalColumn;
    });
    // functions that check validity and add schema to the store
    const { addTableSchema, deleteTableSchema, addColumnSchema } = (0, schemaStore_1.default)((state) => state);
    const handleSubmit = () => {
        // table must be added to schema first to enable column validity checks
        try {
            if (mode === 'table')
                addTableSchema(tableName, columnData);
            else if (mode === 'column') {
                addColumnSchema(tableName, columnData);
            }
            return true;
        }
        catch (error) {
            window.alert(error);
            console.error(error);
            return false;
        }
    };
    const newColumn = {
        name: `column_${columnData.length + 1}`,
        type: 'VARCHAR(255)',
        isNullable: false,
        isPrimary: false,
        defaultValue: null,
    };
    const addColumn = () => {
        setColumnData((prevColumns) => {
            prevColumns.push(newColumn);
            return [...prevColumns];
        });
    };
    const deleteColumn = (index) => {
        setColumnData((prevColumns) => {
            prevColumns.splice(index, 1);
            return [...prevColumns];
        });
    };
    const handleColumnChange = (index, property, value) => {
        setColumnData((prevColumns) => {
            // isPrimary is special. Only one column may be pk. Extra logic required
            if (property !== 'isPrimary') {
                // TODO: LEARN WHY TS IS YELLING
                prevColumns[index][property] = value;
                return [...prevColumns];
            }
            // Disables unchecking pk
            else if (!value)
                return prevColumns;
            else {
                // If checking new column, uncheck old pk
                for (const column of prevColumns) {
                    column.isPrimary = false;
                }
                prevColumns[index].isPrimary = true;
                return [...prevColumns];
            }
        });
    };
    const columnInputs = columnData.map((col, index) => (react_1.default.createElement(ColumnInput_1.default, { key: `column-${index}`, index: index, deleteColumn: deleteColumn, handleColumnChange: handleColumnChange, name: col.name, type: col.type, isNullable: col.isNullable, isPrimary: col.isPrimary, defaultValue: col.defaultValue, columnCount: columnData.length, mode: mode })));
    return (react_1.default.createElement("div", { id: "inputModal", className: "input-modal" },
        react_1.default.createElement("form", { autoComplete: "off", onSubmit: (e) => {
                e.preventDefault();
                const isSuccessful = handleSubmit();
                if (isSuccessful)
                    closeInputModal();
            }, className: "modal-content  rounded-md  bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]" },
            react_1.default.createElement("div", { className: "table-name" }, mode === 'table' ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("label", { htmlFor: "table-modal-name", className: "  text-slate-900 dark:text-[#f8f4eb]" }, "Table Name"),
                react_1.default.createElement("input", { id: "table-modal-name", value: tableName, required: true, maxLength: 63, onChange: (e) => setTableName(e.target.value.trim()) }))) : (react_1.default.createElement("h1", null, `Table Name: ${tableName}`))),
            react_1.default.createElement("div", { className: "column-header" },
                react_1.default.createElement("h1", { className: "  text-slate-900 dark:text-[#f8f4eb]" }, mode === 'table' ? 'Columns' : 'New Columns'),
                react_1.default.createElement("button", { type: "button", className: "  text-slate-900 dark:text-[#f8f4eb]", onClick: addColumn, "data-testid": "add-table-add-column" }, "Add Column")),
            columnInputs,
            react_1.default.createElement("div", { className: "mx-auto flex w-[50%] max-w-[200px] justify-between" },
                react_1.default.createElement("button", { type: "button", className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]", onClick: closeInputModal, "data-testid": "modal-cancel" }, "Cancel"),
                react_1.default.createElement("button", { className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]", "data-testid": "modal-submit" }, mode === 'table' ? 'Create Table' : 'Submit')))));
}
exports.default = InputModal;
//# sourceMappingURL=InputModal.js.map