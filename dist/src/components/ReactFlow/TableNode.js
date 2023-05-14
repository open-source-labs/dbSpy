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
const reactflow_1 = require("reactflow");
const TableNodeColumn_1 = __importDefault(require("./TableNodeColumn"));
const fa_1 = require("react-icons/fa");
const settingsStore_1 = __importDefault(require("../../store/settingsStore"));
function TableNode({ data }) {
    const tableName = data.table[0];
    // columnData is an array of objects with each column in the table as an element
    const columnData = Object.values(data.table[1]);
    // const [tableColumns, setTableColumns] = useState(columnData);
    const { setInputModalState } = (0, settingsStore_1.default)((state) => state);
    // function to generate handles on the table by iterating through all
    // schema edges to match source and target handles of edges to handle id
    const tableHandles = [];
    for (let i = 0; i < data.edges.length; i++) {
        if (data.edges[i].source === tableName) {
            //make handle placement dynamic, we need to know the column of our source
            let columnNumberSource = columnData.findIndex((obj) => obj.Name === data.edges[i].sourceHandle) + 1;
            if (columnNumberSource === 0)
                columnNumberSource = 1;
            tableHandles.push(React.createElement(reactflow_1.Handle, { key: `${data.edges[i]}-source-${[i]}`, type: "source", position: reactflow_1.Position.Right, id: data.edges[i].sourceHandle, style: {
                    background: 'transparent',
                    top: 67 + ((columnNumberSource - 1) * 24),
                    // bottom: 'auto',
                } }));
        }
        if (data.edges[i].target === tableName) {
            //make handle placement dynamic, we need to know the column of our target
            let columnNumberTarget = columnData.findIndex((obj) => obj.Name === data.edges[i].targetHandle) + 1;
            //console.log("columnNumberTarget", columnNumberTarget)
            if (columnNumberTarget === 0)
                columnNumberTarget = 1;
            tableHandles.push(React.createElement(reactflow_1.Handle, { key: `${data.edges[i]}-target-${[i]}`, type: "target", position: reactflow_1.Position.Left, id: data.edges[i].targetHandle, style: {
                    background: 'transparent',
                    top: 67 + ((columnNumberTarget - 1) * 24),
                    // bottom: 'auto',
                } }));
        }
    }
    // renders columns within table
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "table-node transition-colors duration-500", key: tableName },
            React.createElement("div", { className: "flex items-center justify-between table-header relative bg-[#075985] dark:bg-opacity-75" },
                tableHandles,
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "text", className: "bg-[#075985] text-white text-stroke-black dark:bg-opacity-0", style: {
                            'marginLeft': '0px'
                        } }, tableName)),
                React.createElement("div", { className: "addRowBtn ml-3 mb-1.5" },
                    React.createElement("button", { className: "add-field transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7] bg-transparent", onClick: () => setInputModalState(true, 'column', tableName) },
                        React.createElement(fa_1.FaRegPlusSquare, { size: 20, className: "text-white" })))),
            React.createElement("div", { style: { maxHeight: "400px", maxWidth: "600px" }, className: "nowheel overflow-auto" },
                React.createElement("div", { className: "table-bg transition-colors duration-500 dark:bg-slate-700" },
                    React.createElement("table", { className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                        React.createElement("thead", null,
                            React.createElement("tr", { className: "head-column" },
                                React.createElement("th", { scope: "col", className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                                    React.createElement("b", null, "Column")),
                                React.createElement("th", { scope: "col", className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                                    React.createElement("b", null, "Type")),
                                React.createElement("th", { scope: "col", className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                                    React.createElement("b", null, "Constraints")),
                                React.createElement("th", { scope: "col", className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                                    React.createElement("b", null, "PK")),
                                React.createElement("th", { scope: "col", className: "transition-colors duration-500 dark:text-[#fbf3de]" },
                                    React.createElement("b", null, "FK")))),
                        React.createElement("tbody", null, columnData.map((column, index) => (React.createElement(TableNodeColumn_1.default, { column: column, key: `${tableName}-column${index}`, id: `${tableName}-column${index}` }))))))))));
}
exports.default = TableNode;
//# sourceMappingURL=TableNode.js.map