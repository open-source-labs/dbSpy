"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const settingsStore_1 = __importDefault(require("../../store/settingsStore"));
const fa_1 = require("react-icons/fa");
const DataTypeOptions_1 = __importDefault(require("../Modals/DataTypeOptions"));
function TableNodeColumn({ column, id, }) {
    const { schemaStore, setSchemaStore, deleteColumnSchema } = (0, schemaStore_1.default)((state) => state);
    const { setEditRefMode } = (0, settingsStore_1.default)((state) => state);
    // Columns can be in one of three modes: default, edit, or delete
    const [mode, setMode] = (0, react_2.useState)('default');
    const [columnData, setColumnData] = (0, react_2.useState)({ ...column });
    const onSave = () => {
        const currentSchema = { ...schemaStore };
        currentSchema[columnData.TableName][columnData.field_name] = {
            ...columnData,
            // References was updated by AddReference modal, this avoids that change being overwritten
            References: currentSchema[columnData.TableName][columnData.field_name].References,
        };
        // If column name has changed, delete entry with old column name
        if (column.field_name !== columnData.field_name) {
            delete currentSchema[column.TableName][column.field_name];
        }
        setSchemaStore(currentSchema);
        setMode('default');
    };
    const onDelete = () => {
        //declare prior values
        const tableRef = columnData.TableName;
        const colRef = columnData.field_name;
        deleteColumnSchema(tableRef, colRef);
    };
    const openAddReferenceModal = () => {
        // document.querySelector('#mySideNav').style.width = '400px';
        // document.querySelector('#main').style.marginRight = '400px';
        setEditRefMode(true, columnData.TableName, columnData.Name);
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("tr", { key: column.field_name, id: column.field_name, className: "dark:text-[#f8f4eb] " },
            react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]", id: `${id}-field_name` }, mode === 'edit' ? (react_1.default.createElement("input", { className: "bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black", value: columnData.field_name, onChange: (e) => setColumnData((prevData) => ({
                    ...prevData,
                    Name: e.target.value,
                    field_name: e.target.value.replaceAll(/\s/g, '_'),
                })) })) : (columnData.field_name)),
            react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]", id: `${id}-data_type` }, mode === 'edit' ? (react_1.default.createElement("select", { className: "bg-[#f8f4eb] dark:text-black", value: columnData.data_type, onChange: (e) => setColumnData((prevData) => ({
                    ...prevData,
                    data_type: e.target.value,
                })) },
                react_1.default.createElement(DataTypeOptions_1.default, null))) : (columnData.data_type)),
            react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]", id: `${id}-additional_constraints` }, mode === 'edit' ? (react_1.default.createElement("select", { className: "bg-[#f8f4eb] dark:text-black" },
                react_1.default.createElement("option", { value: "NA" }, "NA"),
                react_1.default.createElement("option", { value: "NOT NULL" }, "NOT NULL"),
                react_1.default.createElement("option", { value: "PRIMARY" }, "PRIMARY"),
                react_1.default.createElement("option", { value: "UNIQUE" }, "UNIQUE"))) : (columnData.additional_constraints)),
            react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]", id: `${id}-IsPrimaryKey` }, columnData.IsPrimaryKey),
            react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]", id: `${id}-IsForeignKey` }, mode === 'edit' ? (react_1.default.createElement("input", { type: "checkbox", className: "bg-[#f8f4eb] dark:text-black", checked: columnData.IsForeignKey, onChange: () => {
                    // don't allow if only one table
                    if (Object.keys(schemaStore).length <= 1) {
                        return window.alert('Must have more than one table to create foreign key constraints');
                    }
                    setColumnData((prevData) => {
                        return {
                            ...prevData,
                            IsForeignKey: !prevData.IsForeignKey,
                        };
                    });
                    // if box is now checked (state hasn't updated yet), open fk modal
                    if (!columnData.IsForeignKey)
                        openAddReferenceModal();
                } })) : (columnData.IsForeignKey)),
            react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]" }, mode === 'edit' ? (react_1.default.createElement("button", { id: `${id}-saveBtn`, onClick: onSave, className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
                react_1.default.createElement(fa_1.FaRegSave, { size: 17 }))) : mode === 'delete' ? (react_1.default.createElement("button", { id: `${id}-confirmBtn`, onClick: () => {
                    onDelete();
                    setMode('default');
                }, className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
                react_1.default.createElement(fa_1.FaRegCheckSquare, { size: 17 }))) : (react_1.default.createElement("button", { id: `${id}-editBtn`, onClick: () => setMode('edit'), className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]", "data-testid": "edit-column" },
                react_1.default.createElement(fa_1.FaRegEdit, { size: 17 })))),
            react_1.default.createElement("td", { className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" }, mode === 'edit' ? (react_1.default.createElement("button", { id: `${id}-cancelBtn`, onClick: () => {
                    setColumnData({ ...column });
                    setMode('default');
                } },
                react_1.default.createElement(fa_1.FaRegWindowClose, { size: 17 }))) : mode === 'delete' ? (react_1.default.createElement("button", { id: `${id}-cancelBtn`, onClick: () => setMode('default') },
                react_1.default.createElement(fa_1.FaRegWindowClose, { size: 17 }))) : (react_1.default.createElement("button", { id: `${id}-deleteBtn`, onClick: () => setMode('delete') },
                react_1.default.createElement(fa_1.FaRegTrashAlt, { size: 17 })))))));
}
exports.default = TableNodeColumn;
//# sourceMappingURL=DataTableNodeColumn.js.map