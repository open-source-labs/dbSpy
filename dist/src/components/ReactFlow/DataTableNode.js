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
const React = __importStar(require("react"));
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const DataTableNodeColumn_1 = __importDefault(require("./DataTableNodeColumn"));
const fa_1 = require("react-icons/fa");
const settingsStore_1 = __importDefault(require("../../store/settingsStore"));
const dataStore_1 = __importDefault(require("../../store/dataStore"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const react_2 = __importDefault(require("@tippyjs/react"));
require("tippy.js/dist/tippy.css");
const informationSqIcon_png_1 = __importDefault(require("../../../images/informationSqIcon.png"));
const credentialsStore_1 = __importDefault(require("../../store/credentialsStore"));
function DataTableNode({ data }) {
    console.log('data', data);
    const newdata = structuredClone(data);
    const [tableData, setTableData] = (0, react_1.useState)(newdata.table);
    const { setInputModalState } = (0, settingsStore_1.default)((state) => state);
    const { dataStore, referenceStore } = (0, dataStore_1.default)((state) => state);
    const setDataStore = (0, dataStore_1.default)((state) => state.setDataStore);
    const setReferenceStore = (0, dataStore_1.default)((state) => state.setReferencesStore);
    const { schemaStore } = (0, schemaStore_1.default)((state) => state);
    const { dbCredentials } = (0, credentialsStore_1.default)((state) => state);
    const infoIconStr = "Please strictly follow syntax of your database. Ex) leave blank for auto-generating values, primary key must have value, etc. It may cause an error in updating database if you not strictly follow the syntax.";
    //split up the table into different parts based on how the data is structured.
    const tableName = tableData[0];
    let firstRow = [];
    let restRowsData = [];
    let secondaryFirstRow = [];
    let RowData = Object.values(tableData[1]);
    //Used to grab the primary key and foreign keys column in the Table
    let schemaName = schemaStore[`public.${tableName}`];
    let PK = null;
    let FK = null;
    let pkVals = new Set();
    for (let key in schemaName) {
        if (schemaName[key]['IsForeignKey'])
            FK = schemaName[key].field_name;
        if (schemaName[key]['IsPrimaryKey'])
            PK = schemaName[key].field_name;
    }
    //loop through all of RowData, grab each primary key value and store it in object<pkVals>
    for (let i = 0; i < RowData.length; i++) {
        if (PK !== null) {
            pkVals.add(RowData[i][PK]);
        }
    }
    /////////////// FOR EDGE CASE CONSTRAINT THAT PREVENT ROW DELETED THAT HAS A FOREIGN KEY REFERENCING TO THAT ROW ////////////
    // UseEffect on Mount to grab all the Foreign Key reference and store it in reference store because of constraint, *cant delete the row that has 
    // a foreign key referenced to it.
    // useEffect(()=>{
    //   //loop through all of the schemastore in current table to grab all the schema info referencing foreignkey
    //   for(let columnKey in schemaName){
    //     if(schemaName[columnKey].References[0]){
    //       const toForeignKey = {};
    //       const fromForeignKey = new Set();
    //       const toTableName:string = schemaName[columnKey].References[0].PrimaryKeyTableName.replace('public.',"");
    //       const toColumnName:string = schemaName[columnKey].References[0].PrimaryKeyName;
    //       const fromTableName:string = schemaName[columnKey].References[0].ReferencesTableName.replace('public.',"");
    //       const fromColumnName:string = schemaName[columnKey].References[0].ReferencesPropertyName;
    //       //loop throw all of the Rowdata and grab data if there is a corresponding foreign key
    //       for(let i = 0; i < RowData.length; i++){
    //         if(RowData[i][fromColumnName] !== null){
    //           fromForeignKey.add(RowData[i][fromColumnName]);
    //         }
    //       }
    //       //assign to the state reference store
    //       toForeignKey[toTableName] = {[toColumnName]:fromForeignKey};
    //       const currentRef = structuredClone(referenceStore);
    //       //console.log('prereference' ,referenceStore) 
    //       setReferenceStore({...currentRef,...toForeignKey});
    //       //console.log('post reference',referenceStore) //// ** State of referenceStore is not updating right away after setting referenceStore, only update on page mount?
    //     }
    //    }
    //  },[dataStore])
    //////////////////////////////////////////////////////
    //check if
    if (schemaName !== undefined) {
        secondaryFirstRow = Object.keys(schemaStore['public.' + tableName]);
    }
    //Filter out Schemas from data, not sure why schema data would show sometime.
    if (RowData[0] !== undefined) {
        if (RowData[0].IsForeignKey === undefined) {
            firstRow = Object.keys(RowData[0]);
            restRowsData = [...RowData];
        }
    }
    else {
        firstRow = secondaryFirstRow;
    }
    //UseEffect set Table when the dataStore is changed after on Delete.
    (0, react_1.useEffect)(() => {
        setTableData([tableName, dataStore[tableName]]);
    }, [dataStore]);
    const deleteRow = async (value, index, id) => {
        ////////////////////////// CHECK TO SEE IF IT HAS A REFERENCE FOREIGN KEY BEFORE DELETE/////////////
        //loop through all of deleteRow values and check if there is a corresponding referenceStore, if so throw error because it has a corresponding foreign key. 
        //   for(let col in value){
        //   if(referenceStore[id] !== undefined ){
        //     if(referenceStore[id][col] !== undefined ){
        //       if(referenceStore[id][col].has(value[col])){
        //         alert(`Can't Delete Foreign Key: ${col}`);
        //         throw new Error(`Can't Delete Foreign Key: ${col}`);
        //       }
        //     }
        //   }
        // }
        /////////////////////////////////////////////////////////////////////////
        const newDatastore = structuredClone(dataStore);
        restRowsData = restRowsData.slice(0, index).concat(restRowsData.slice(index + 1, restRowsData.length));
        newDatastore[tableName] = restRowsData;
        setDataStore({ ...newDatastore, [id]: restRowsData });
        // setDataStore(restRowData);
        if ('db_type' in dbCredentials) {
            const sendDeleteRequest = fetch(`/api/sql/${dbCredentials.db_type}/deleteRow`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableName: tableName, primaryKey: PK, value: PK !== null ? value[PK] : null })
            });
        }
        if (PK !== null && value[PK] !== undefined) {
            const sendDeleteRequest = fetch(`/api/sql/${dbCredentials.db_type}/deleteRow`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableName: tableName, primaryKey: PK, value: value[PK] })
            })
                .then((res) => {
                console.log("deleting row info sent");
            })
                .catch((err) => { console.error('deleting row error', err); });
        }
        else {
            console.log('i am here!! there is no PK or value[PK]');
            const sendDeleteRequest = fetch(`/api/sql/${dbCredentials.db_type}/deleteRow`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableName: tableName, deletedRow: value })
            })
                .then((res) => {
                console.log("deleting row info sent");
            })
                .catch((err) => { console.error('deleting row error', err); });
        }
        ////////////////// Fetch path: /api/delete ///////////////////
        // {
        //  tableName: name of table,
        //  primaryKey: primary key,
        //  value: corresponding value of the primary key
        // }
        ////////////////////////////////////////////
    };
    //cannot make handles for data table dynamic since size of each column can vary
    //TODO: is there better way to assign handle?
    const tableHandles = [];
    for (let i = 0; i < data.edges.length; i++) {
        if (data.edges[i].source === tableName) {
            let columnNumberSource = firstRow.findIndex((eachColumnName) => eachColumnName === data.edges[i].sourceHandle) + 1;
            if (columnNumberSource === 0)
                columnNumberSource = 1;
            tableHandles.push(React.createElement(reactflow_1.Handle, { key: `${data.edges[i]}-source-${[i]}`, type: "source", position: reactflow_1.Position.Top, id: data.edges[i].sourceHandle, style: {
                    background: 'transparent',
                    // left: "25%" + ((columnNumberSource - 1) * 30)
                    left: 62 + ((columnNumberSource - 1) * 40)
                } }));
        }
        if (data.edges[i].target === tableName) {
            let columnNumberTarget = firstRow.findIndex((obj) => obj.Name === data.edges[i].targetHandle) + 1;
            if (columnNumberTarget === 0)
                columnNumberTarget = 1;
            tableHandles.push(React.createElement(reactflow_1.Handle, { key: `${data.edges[i]}-target-${[i]}`, type: "target", position: reactflow_1.Position.Top, id: data.edges[i].targetHandle, style: {
                    background: 'transparent',
                    left: 15
                } }));
        }
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "table-node transition-colors duration-500", key: tableName },
            React.createElement("div", { className: "flex items-center justify-between table-header relative bg-[#075985] dark:opacity-75" },
                tableHandles,
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "text", className: "bg-[#075985] dark:opacity-75 text-white text-stroke-black dark:bg-opacity-0", style: {
                            'marginLeft': '0px'
                        } }, tableName)),
                React.createElement("div", { className: "addRowBtn ml-3 mb-1.5 flex position" },
                    React.createElement("button", { className: "add-field transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7] bg-transparent", onClick: () => setInputModalState(true, 'row', tableName) },
                        React.createElement(fa_1.FaRegPlusSquare, { size: 20, className: "text-white" })),
                    React.createElement("div", { className: 'mt-2 mr-2' },
                        React.createElement(react_2.default, { content: infoIconStr, placement: "top", trigger: "mouseenter click" },
                            React.createElement("img", { src: informationSqIcon_png_1.default, alt: "Information Icon", className: "h-3 rounded-full ml-0" }))))),
            React.createElement("div", { style: { maxHeight: "350px", maxWidth: "600px" }, className: "nowheel overflow-auto scrollbar-hide" },
                React.createElement("div", { className: "table-bg transition-colors duration-500 dark:bg-slate-700" },
                    React.createElement("table", { className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                        React.createElement("thead", null,
                            React.createElement("tr", { className: "head-column" }, firstRow?.map(each => (React.createElement("th", { key: each, scope: "col", className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                                React.createElement("b", null, each)))))),
                        React.createElement("tbody", null, restRowsData.map((row, index) => {
                            return (React.createElement(DataTableNodeColumn_1.default, { row: row, key: `${tableName}-row${index}`, id: tableName, index: index, deleteRow: deleteRow, FK: FK, PK: [PK, pkVals] }));
                        }))))))));
}
exports.default = DataTableNode;
//# sourceMappingURL=DataTableNode.js.map