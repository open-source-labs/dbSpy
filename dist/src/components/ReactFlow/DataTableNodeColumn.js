"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
const fa_1 = require("react-icons/fa");
function DataTableNodeColumn({ row, id, deleteRow, index, PK }) {
    //####### for CRUD ##########
    const newRow = structuredClone(row);
    const [rowData, setRowData] = (0, react_2.useState)({ ...newRow });
    const [tempData, setTempData] = (0, react_2.useState)({ ...newRow });
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    //reset the state when row changes. Specifically for on-delete functionality. 
    (0, react_2.useEffect)(() => {
        setRowData({ ...newRow });
        setTempData({ ...newRow });
    }, [row]);
    const [mode, setMode] = (0, react_2.useState)('default');
    const rowDataKeys = Object.keys(row);
    const onCancel = () => {
        setTempData(rowData);
        setMode('default');
    };
    const onSave = async () => {
        const changes = {};
        changes.tableName = id;
        changes.newRow = { ...tempData };
        changes.primaryKey = { [PK[0]]: changes.newRow[PK[0]] };
        console.log(changes);
        //delete primary key column from change for fetch request.
        delete changes.newRow[PK[0]];
        const checkConstraints = {};
        //iterate through and find the changes between new and old data.
        for (let currentKey in tempData) {
            if (tempData[currentKey] !== rowData[currentKey]) {
                checkConstraints[currentKey] = tempData[currentKey];
            }
        }
        for (let currentKey in checkConstraints) {
            if (PK[0] === currentKey && PK[1].has(parseInt(checkConstraints[currentKey]))) {
                alert(`Duplicate Primary Key: ${PK[0]}`);
                setTempData(rowData);
                setMode('default');
                throw new Error('Duplicate Primary Key');
            }
        }
        setRowData({ ...tempData });
        setMode('default');
        const sendChangesRequest = await fetch(`/api/sql/${dbCredentials.db_type}/updateRow`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changes)
        });
        const data = await sendChangesRequest.json();
        console.log(data);
    };
    /////////////////////////////////
    // Patch Request edit Data endpoint: /api/updateRow
    // Body: {
    //  newRow:{new updated row},
    //  tableName: name of the table
    //  }
    ////////////
    return (react_1.default.createElement("tr", { key: id, className: "dark:text-[#f8f4eb]" },
        rowDataKeys.map((element, ind) => react_1.default.createElement("td", { className: "dark:text-[#f8f4eb]", key: `${id}-${ind}` }, mode === 'edit' ?
            (react_1.default.createElement("input", { className: "bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black", value: tempData[element], onChange: (e) => {
                    setTempData((prevData) => ({
                        ...prevData,
                        [element]: e.target.value
                    }));
                } })) :
            (rowData[element]))),
        react_1.default.createElement("td", null, mode === 'default' ?
            (react_1.default.createElement("button", { onClick: () => setMode('edit'), className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
                react_1.default.createElement(fa_1.FaRegEdit, { size: 17 }))) :
            mode === 'edit' ?
                (react_1.default.createElement("button", { onClick: onSave, className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
                    react_1.default.createElement(fa_1.FaRegSave, { size: 17 }))) :
                (react_1.default.createElement("button", { onClick: () => {
                        deleteRow(rowData, index, id);
                        setMode('default');
                    }, className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
                    react_1.default.createElement(fa_1.FaRegCheckSquare, { size: 17 })))),
        react_1.default.createElement("td", null, mode === 'default' ?
            (react_1.default.createElement("button", { id: `${id}-rowDeleteBtn`, onClick: () => setMode(id), className: "transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" },
                react_1.default.createElement(fa_1.FaRegTrashAlt, { size: 17 }))) :
            (react_1.default.createElement("button", { id: `${id}-cancelBtn`, onClick: onCancel },
                react_1.default.createElement(fa_1.FaRegWindowClose, { size: 17 }))))));
}
exports.default = DataTableNodeColumn;
//# sourceMappingURL=DataTableNodeColumn.js.map