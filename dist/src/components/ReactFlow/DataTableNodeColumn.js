"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
const fa_1 = require("react-icons/fa");
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
function DataTableNodeColumn({ row, id, deleteRow, index, PK }) {
    // we need a tempData and rowData as seperate states because if the edit was canceled need to revert back to original state prior to change.
    const newRow = structuredClone(row);
    const [rowData, setRowData] = (0, react_2.useState)({ ...newRow });
    const [tempData, setTempData] = (0, react_2.useState)({ ...newRow });
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    const { schemaStore } = (0, schemaStore_1.default)((state) => state);
    //reset the state when row changes. Specifically for on-delete functionality. 
    (0, react_2.useEffect)(() => {
        setRowData({ ...newRow });
        setTempData({ ...newRow });
    }, [row]);
    const [mode, setMode] = (0, react_2.useState)('default');
    const rowDataKeys = Object.keys(row);
    ;
    ;
    ;
    const onCancel = () => {
        setTempData(rowData);
        setMode('default');
    };
    //on save suppose to save changes to edits on data row.
    const onSave = async () => {
        //create changes object to store all the data needed to send to the backend
        const changes = {};
        changes.tableName = id;
        changes.newRow = { ...tempData };
        let primaryKeyData = null;
        if (schemaStore.hasOwnProperty(id)) {
            const tableData = schemaStore[id];
            for (const columnName in tableData) {
                const column = tableData[columnName];
                if (column.IsPrimaryKey) {
                    primaryKeyData = { [columnName]: changes.newRow[columnName] };
                    delete changes.newRow[columnName];
                }
            }
        }
        else {
            window.alert(`The table ${changes.tableName} does not have a Primary Key, cannot update without one`);
            console.error(`The table ${changes.tableName} does not have a Primary Key, cannot update without one`);
            return;
        }
        changes.primaryKey = primaryKeyData;
        setRowData({ ...tempData });
        setMode('default');
        await fetch(`/api/sql/${dbCredentials.db_type}/updateRow`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changes)
        })
            .then((data) => data.json())
            .then((data) => {
            console.log(data);
        })
            .catch((err) => {
            console.log('ERROR: ', err);
        });
    };
    /////////////////////////////////
    // Patch Request edit Data endpoint: /api/updateRow
    // Body: {
    //  newRow:{new updated row},
    //  tableName: name of the table
    //  }
    ////////////
    //setTemp data at the current column element to its value based whenever changed.
    return (react_1.default.createElement("tr", { key: id, className: "dark:text-[#f8f4eb]" },
        rowDataKeys.map((element, ind) => react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]", key: `${id}-${ind}` }, mode === 'edit' ?
            (react_1.default.createElement("input", { className: "bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black", value: tempData[element], onChange: (e) => {
                    setTempData((prevData) => ({
                        ...prevData,
                        [element]: e.target.value
                    }));
                } })) :
            (rowData[element]))),
        react_1.default.createElement("td", null, mode === 'default' ? (react_1.default.createElement("button", { onClick: () => setMode('edit'), className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
            react_1.default.createElement(fa_1.FaRegEdit, { size: 17 }))) : mode === 'edit' ? (react_1.default.createElement("button", { onClick: onSave, className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
            react_1.default.createElement(fa_1.FaRegSave, { size: 17 }))) : (react_1.default.createElement("button", { className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]", onClick: () => {
                deleteRow(rowData, index, id);
                setMode('default');
            } },
            react_1.default.createElement(fa_1.FaRegCheckSquare, { size: 17 })))),
        react_1.default.createElement("td", null, mode === 'default' ? (react_1.default.createElement("button", { id: `${id}-rowDeleteBtn`, onClick: () => setMode('trash'), className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
            react_1.default.createElement(fa_1.FaRegTrashAlt, { size: 17 }))) : (react_1.default.createElement("button", { id: `${id}-cancelBtn`, onClick: onCancel },
            react_1.default.createElement(fa_1.FaRegWindowClose, { size: 17 }))))));
}
exports.default = DataTableNodeColumn;
;
//# sourceMappingURL=DataTableNodeColumn.js.map