"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const DataTypeOptions_1 = __importDefault(require("./DataTypeOptions"));
const react_2 = require("react");
function ColumnInput({ index, deleteColumn, handleColumnChange, name, type, isNullable, isPrimary, defaultValue, columnCount, mode, }) {
    const [columnName, setColumnName] = (0, react_2.useState)('');
    const [columnType, setColumnType] = (0, react_2.useState)('');
    const sendNewColumnToBackend = () => {
        console.log('cN', columnName);
        console.log('cT', columnType);
    };
    return (react_1.default.createElement("div", { className: "column-input" },
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { className: " text-center text-slate-900 dark:text-[#f8f4eb]", htmlFor: `column-${index}-name` }, "Column Name"),
            react_1.default.createElement("input", { type: "text", id: `column-${index}-name`, required: true, maxLength: 63, value: name, onChange: (e) => {
                    setColumnName(e.target.value);
                    handleColumnChange(index, 'name', e.target.value.trim());
                } })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { className: " text-center text-slate-900 dark:text-[#f8f4eb]", htmlFor: `column-${index}-type` }, "Type"),
            react_1.default.createElement("select", { id: `column-${index}-type`, defaultValue: type, onChange: (e) => {
                    setColumnType(e.target.value);
                    handleColumnChange(index, 'type', e.target.value);
                } },
                react_1.default.createElement(DataTypeOptions_1.default, null))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { className: " text-center text-slate-900 dark:text-[#f8f4eb]", htmlFor: `column-${index}-isNullable` }, "Nullable"),
            react_1.default.createElement("input", { type: "checkbox", id: `column-${index}-isNullable`, checked: isNullable, onChange: () => handleColumnChange(index, 'isNullable', !isNullable) })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { className: " text-center text-slate-900 dark:text-[#f8f4eb]", htmlFor: `column-${index}-default-val` }, "Default Value"),
            react_1.default.createElement("input", { type: "text", id: `column-${index}-default-val`, maxLength: 63, placeholder: "(NULL)", value: defaultValue || '', onChange: (e) => handleColumnChange(index, 'defaultValue', e.target.value) })),
        mode === 'table' && (react_1.default.createElement("div", null,
            react_1.default.createElement("label", { className: " text-center text-slate-900 dark:text-[#f8f4eb]", htmlFor: `column-${index}-primary` }, "Primary Key"),
            react_1.default.createElement("input", { type: "checkbox", id: `column-${index}-primary`, checked: isPrimary, onChange: () => handleColumnChange(index, 'isPrimary', !isPrimary) }))),
        columnCount > 1 && (react_1.default.createElement("button", { type: "button", className: " text-center text-slate-900 dark:text-[#f8f4eb]", onClick: () => deleteColumn(index) }, "X"))));
}
exports.default = ColumnInput;
//# sourceMappingURL=ColumnInput.js.map