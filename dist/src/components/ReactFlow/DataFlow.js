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
const flowStore_1 = __importDefault(require("../../store/flowStore"));
// import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
const dataStore_1 = __importDefault(require("../../store/dataStore"));
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const reactflow_1 = __importStar(require("reactflow"));
require("reactflow/dist/style.css");
const DownloadButton_1 = __importDefault(require("./DownloadButton"));
const TableNodeForData_1 = __importDefault(require("./TableNodeForData"));
const createDataEdges_1 = __importDefault(require("./createDataEdges"));
const createDataNodes_1 = __importDefault(require("./createDataNodes"));
const nodeTypes = {
    table: TableNodeForData_1.default,
    // table: TableNode,
};
function DataFlow() {
    // set up states for nodes and edges
    const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } = (0, flowStore_1.default)((state) => state);
    const { dataStore } = (0, dataStore_1.default)(((state) => state));
    //need to finish build dataStore###################
    // re-render every time dataStore updates
    (0, react_2.useEffect)(() => {
        reRender(dataStore);
    }, [dataStore]);
    function reRender(dataStore) {
        if (!dataStore || !Object.keys(dataStore).length)
            return;
        const initialEdges = (0, createDataEdges_1.default)(dataStore);
        setEdges(initialEdges);
        const initialNodes = (0, createDataNodes_1.default)(dataStore, initialEdges);
        setNodes(initialNodes);
    }
    console.log('dataStore', dataStore);
    // renders React Flow canvas
    return (react_1.default.createElement("div", { className: "flow", style: { height: '80%', width: '95%' } },
        "I AM DATA FLOW!!!!!",
        react_1.default.createElement(reactflow_1.default
        //this chunk (tables) is not rendering!!
        , { 
            //this chunk (tables) is not rendering!!
            nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onConnect: onConnect, nodeTypes: nodeTypes, fitView: true },
            react_1.default.createElement("div", { id: "download-image" }),
            react_1.default.createElement(reactflow_1.Background, { className: " transition-colors duration-500 dark:bg-slate-800" }),
            react_1.default.createElement(reactflow_1.Controls, null,
                react_1.default.createElement(reactflow_1.ControlButton, null,
                    react_1.default.createElement(DownloadButton_1.default, null))))));
}
exports.default = DataFlow;
//# sourceMappingURL=DataFlow.js.map