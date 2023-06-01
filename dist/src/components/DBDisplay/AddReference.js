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
const settingsStore_1 = __importDefault(require("../../store/settingsStore"));
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
const AddReference = () => {
    const { currentTable, currentColumn, setEditRefMode } = (0, settingsStore_1.default)((state) => state);
    const { schemaStore, addForeignKeySchema, setSchemaStore } = (0, schemaStore_1.default)((state) => state);
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    // Constraint Names have a character limit depending on the database
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
    // Starting values for the formValues
    const initialReference = {
        PrimaryKeyName: '',
        PrimaryKeyTableName: '',
        ReferencesPropertyName: currentColumn,
        ReferencesTableName: currentTable,
        isDestination: false,
        constraintName: '',
    };
    const [formValues, setFormValues] = (0, react_1.useState)(initialReference);
    const [tableSelected, setTableSelected] = (0, react_1.useState)(false);
    const [columnSelected, setColumnSelected] = (0, react_1.useState)(false);
    //HELPERS HELPER FUNCTION
    const nullCheck = () => {
        const mySideNav = document.getElementById('mySideNav');
        const main = document.getElementById('main');
        if (mySideNav !== null && main !== null) {
            mySideNav.style.width = '0px';
            main.style.marginRight = '50px';
        }
        ;
    };
    //HELPER FUNCTIONS
    const onSave = async (e) => {
        e.preventDefault();
        try {
            /**React Flow hack.
             * Problem: Viewports larger than 1197x1197px prevent edges from rendering
             * Hacky Solution: Minify RF. Send resize-func to task queue so RF only returns to normal once edge rendering is complete
             * Process is fast enough to not be noticeable to user
             */
            nullCheck();
            const updatedForeignKey = {
                PrimaryKeyTableName: formValues.PrimaryKeyTableName,
                PrimaryKeyColumnName: formValues.PrimaryKeyName,
                ForeignKeyTableName: formValues.ReferencesTableName,
                ForeignKeyColumnName: formValues.ReferencesPropertyName,
                constraintName: formValues.constraintName.replace(/[^a-zA-Z0-9_]/g, "")
            };
            // Front end Error checking for Oracle SQL
            if (dbCredentials.db_type === 'oracle' && schemaStore[formValues.PrimaryKeyTableName][formValues.PrimaryKeyName].References[0].isDestination === true) {
                window.alert(`Oracle SQL only allows for a Primary Key to be a part of a single Foreign Key. Column ${formValues.PrimaryKeyName} of table ${formValues.PrimaryKeyTableName} already has a Foreign Key associated with it`);
                console.error(`Oracle SQL only allows for a Primary Key to be a part of a single Foreign Key. Column ${formValues.PrimaryKeyName} of table ${formValues.PrimaryKeyTableName} already has a Foreign Key associated with it`);
                return;
            }
            await fetch(`/api/sql/${dbCredentials.db_type}/addForeignKey`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedForeignKey)
            });
            await Promise.resolve(setSchemaStore({
                ...schemaStore,
                [formValues.PrimaryKeyTableName]: {
                    ...schemaStore[formValues.PrimaryKeyTableName],
                    [formValues.PrimaryKeyName]: {
                        ...schemaStore[formValues.PrimaryKeyTableName][formValues.PrimaryKeyName],
                        References: [
                            ...schemaStore[formValues.PrimaryKeyTableName][formValues.PrimaryKeyName].References,
                            {
                                isDestination: true,
                                PrimaryKeyName: formValues.PrimaryKeyName,
                                PrimaryKeyTableName: formValues.PrimaryKeyTableName,
                                ReferencesPropertyName: formValues.ReferencesPropertyName,
                                ReferencesTableName: formValues.ReferencesTableName,
                                constraintName: formValues.constraintName.replace(/[^a-zA-Z0-9_]/g, "")
                            },
                        ],
                    },
                },
            }));
            document.querySelector('.flow')?.setAttribute('style', 'height: 10%; width: 10%;');
            addForeignKeySchema(formValues);
            console.log('schemaStore', schemaStore);
            setEditRefMode(false);
            setTimeout(() => document.querySelector('.flow')?.setAttribute('style', 'height: 80%; width: 95%;'), 0);
            return;
        }
        catch (err) {
            document.querySelector('.flow')?.setAttribute('style', 'height: 80%; width: 95%;');
            window.alert(err);
            console.error(err);
        }
        ;
    };
    const onCancel = (e) => {
        e.preventDefault();
        try {
            nullCheck();
            setEditRefMode(false);
        }
        catch (err) {
            window.alert(err);
            console.error(err);
        }
    };
    //END: HELPER FUNCTIONS
    const tableOptions = [react_1.default.createElement("option", { key: "---" }, "---")];
    for (const table in schemaStore) {
        if (table !== currentTable) {
            tableOptions.push(react_1.default.createElement("option", { key: table, value: table }, table));
        }
        ;
    }
    ;
    const columnOptions = [react_1.default.createElement("option", { key: "---" }, "---")];
    for (const col in schemaStore[formValues.PrimaryKeyTableName]) {
        if (schemaStore[formValues.PrimaryKeyTableName][col].IsPrimaryKey) {
            columnOptions.push(react_1.default.createElement("option", { key: col, value: col }, col));
        }
        ;
    }
    ;
    return react_1.default.createElement("div", { id: "addReference", className: "bg-[#fbf3de] dark:bg-slate-700" },
        react_1.default.createElement("label", { className: "dark:text-[#f8f4eb]" },
            react_1.default.createElement("h3", null, "Foreign Key References")),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("p", { className: "dark:text-white" },
                "Table: ",
                react_1.default.createElement("strong", null, currentTable))),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("p", { className: "dark:text-white" },
                "Column: ",
                react_1.default.createElement("strong", null, currentColumn))),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "db_type", className: "dark:text-white" }, "FK Table"),
            react_1.default.createElement("select", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", id: "ptablename", name: "ptablename", 
                // defaultValue={reference[0].PrimaryKeyTableName}
                defaultValue: formValues.PrimaryKeyTableName, onChange: (e) => {
                    if (e.target.value === '---')
                        return;
                    setFormValues({
                        ...formValues,
                        PrimaryKeyTableName: e.target.value
                    });
                    setTableSelected(true);
                } }, tableOptions)),
        react_1.default.createElement("br", null),
        tableSelected ? (react_1.default.createElement(react_1.default.Fragment, null,
            ' ',
            react_1.default.createElement("span", { className: "form-item" },
                react_1.default.createElement("label", { htmlFor: "db_type", className: "dark:text-white" }, "FK Column"),
                react_1.default.createElement("select", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", id: "pkeyname", name: "pkeyname", defaultValue: formValues.PrimaryKeyName, 
                    // defaultValue={reference[0].PrimaryKeyName}
                    onChange: (e) => {
                        if (e.target.value === '---')
                            return;
                        setFormValues({
                            ...formValues,
                            PrimaryKeyName: e.target.value,
                            constraintName: `fk_${currentColumn.replace(/[^a-zA-Z0-9_]/g, "")}_to_${e.target.value.replace(/[^a-zA-Z0-9_]/g, "")}`
                        });
                        setColumnSelected(true);
                    } }, columnOptions)),
            react_1.default.createElement("br", null))) : null,
        columnSelected ? (react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "db_type", className: "dark:text-white" }, "Constraint Name"),
            react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", maxLength: maxConstraintNameLength, pattern: "[A-Za-z0-9_]+.{1,}", id: "constraintname", name: "constraintname", defaultValue: formValues.constraintName, onChange: (e) => setFormValues({
                    ...formValues,
                    constraintName: e.target.value.replace(/[^a-zA-Z0-9_]/g, "")
                }) }))) : null,
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "add-ref-btn" },
            react_1.default.createElement("button", { className: "form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg", id: "save", onClick: onSave }, "Save"),
            react_1.default.createElement("button", { className: "form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg", id: "cancel", onClick: onCancel }, "Cancel")),
        react_1.default.createElement("br", null));
};
exports.default = AddReference;
//# sourceMappingURL=AddReference.js.map