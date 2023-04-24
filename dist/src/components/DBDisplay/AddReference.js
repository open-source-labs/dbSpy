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
// React & React Router & React Query Modules;
const react_1 = __importStar(require("react"));
// Components Imported;
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const settingsStore_1 = __importDefault(require("../../store/settingsStore"));
const AddReference = () => {
    const { currentTable, currentColumn, setEditRefMode } = (0, settingsStore_1.default)((state) => state);
    const { schemaStore, addForeignKeySchema } = (0, schemaStore_1.default)((state) => state);
    const initialReference = {
        // For whatever reason, PrimaryKeyName and PrimaryKeyTableName refer to other table
        PrimaryKeyName: '',
        PrimaryKeyTableName: '',
        // ReferencesPropertyName and ReferencesTableName refer to the table we are adding the fk to
        ReferencesPropertyName: currentColumn,
        ReferencesTableName: currentTable,
        IsDestination: false,
        constraintName: `${currentTable}_fk${schemaStore[currentTable][currentColumn].References.length + 1}`,
    };
    //STATE DECLARATION (dbSpy3.0)
    //END: STATE DECLARATION
    //form state hooks
    const [formValues, setFormValues] = (0, react_1.useState)(initialReference);
    //HELPERS HELPER FUNCTION
    const nullCheck = () => {
        const mySideNav = document.getElementById('mySideNav');
        const main = document.getElementById('main');
        if (mySideNav !== null && main !== null) {
            mySideNav.style.width = '0px';
            main.style.marginRight = '50px';
        }
    };
    //HELPER FUNCTIONS
    const onSave = (e) => {
        e.preventDefault();
        try {
            /**React Flow hack.
             * Problem: Viewports larger than 1197x1197px prevent edges from rendering
             * Hacky Solution: Minify RF. Send resize-func to task queue so RF only returns to normal once edge rendering is complete
             * Process is fast enough to not be noticeable to user
             */
            nullCheck();
            document
                .querySelector('.flow')?.setAttribute('style', 'height: 10%; width: 10%;');
            addForeignKeySchema(formValues);
            setEditRefMode(false);
            setTimeout(() => document
                .querySelector('.flow')
                ?.setAttribute('style', 'height: 80%; width: 95%;'), 0);
        }
        catch (err) {
            window.alert(err);
            console.error(err);
        }
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
        if (table !== formValues.ReferencesTableName) {
            tableOptions.push(react_1.default.createElement("option", { key: table, value: table }, table));
        }
    }
    const columnOptions = [react_1.default.createElement("option", { key: "---" }, "---")];
    for (const col in schemaStore[formValues.PrimaryKeyTableName]) {
        columnOptions.push(react_1.default.createElement("option", { key: col, value: col }, col));
    }
    return (react_1.default.createElement("div", { id: "addReference", className: "bg-[#fbf3de] dark:bg-slate-700" },
        react_1.default.createElement("label", { className: "dark:text-[#f8f4eb]" },
            react_1.default.createElement("h3", null, "Foreign Key References")),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("p", { className: "dark:text-white" },
                "Table: ",
                react_1.default.createElement("strong", null, formValues.ReferencesTableName))),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("p", { className: "dark:text-white" },
                "Column: ",
                react_1.default.createElement("strong", null, formValues.ReferencesPropertyName))),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "db_type", className: "dark:text-white" }, "FK Table"),
            react_1.default.createElement("select", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", id: "ptablename", name: "ptablename", 
                // defaultValue={reference[0].PrimaryKeyTableName}
                defaultValue: formValues.PrimaryKeyTableName, onChange: (e) => {
                    if (e.target.value === '---')
                        return;
                    setFormValues({ ...formValues, PrimaryKeyTableName: e.target.value });
                } }, tableOptions)),
        react_1.default.createElement("br", null),
        formValues.PrimaryKeyTableName.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            ' ',
            react_1.default.createElement("span", { className: "form-item" },
                react_1.default.createElement("label", { htmlFor: "db_type", className: "dark:text-white" }, "FK Column"),
                react_1.default.createElement("select", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", id: "pkeyname", name: "pkeyname", defaultValue: formValues.PrimaryKeyName, 
                    // defaultValue={reference[0].PrimaryKeyName}
                    onChange: (e) => {
                        if (e.target.value === '---')
                            return;
                        setFormValues({ ...formValues, PrimaryKeyName: e.target.value });
                    } }, columnOptions)),
            react_1.default.createElement("br", null))),
        react_1.default.createElement("span", { className: "form-item" },
            react_1.default.createElement("label", { htmlFor: "db_type", className: "dark:text-white" }, "Constraint Name"),
            react_1.default.createElement("input", { className: "form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]", type: "text", id: "constraintname", name: "constraintname", value: formValues.constraintName, onChange: (e) => setFormValues({ ...formValues, constraintName: e.target.value }) })),
        react_1.default.createElement("br", null),
        react_1.default.createElement("span", { className: "add-ref-btn" },
            react_1.default.createElement("button", { className: "form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg", id: "save", onClick: onSave }, "Save"),
            react_1.default.createElement("button", { className: "form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg", id: "cancel", onClick: onCancel }, "Cancel")),
        react_1.default.createElement("br", null)));
};
exports.default = AddReference;
//# sourceMappingURL=AddReference.js.map