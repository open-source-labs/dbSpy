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
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const reactflow_1 = __importStar(require("reactflow"));
require("reactflow/dist/style.css");
const DownloadButton_1 = __importDefault(require("./DownloadButton"));
const TableNode_1 = __importDefault(require("./TableNode"));
const createEdges_1 = __importDefault(require("./createEdges"));
const createNodes_1 = __importDefault(require("./createNodes"));
const nodeTypes = {
    table: TableNode_1.default,
};
function Flow() {
    // set up states for nodes and edges
    const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } = (0, flowStore_1.default)((state) => state);
    const { schemaStore } = (0, schemaStore_1.default)((state) => state);
    // re-render every time schemaStore updates
    (0, react_2.useEffect)(() => {
        reRender(schemaStore);
    }, [schemaStore]);
    function reRender(schemaStore) {
        if (!schemaStore || !Object.keys(schemaStore).length)
            return;
        const initialEdges = (0, createEdges_1.default)(schemaStore);
        setEdges(initialEdges);
        const initialNodes = (0, createNodes_1.default)(schemaStore, initialEdges);
        setNodes(initialNodes);
    }
    // renders React Flow canvas
    return (react_1.default.createElement("div", { className: "flow", style: { height: '80%', width: '95%' } },
        react_1.default.createElement(reactflow_1.default, { nodes: nodes, onNodesChange: onNodesChange, edges: edges, onEdgesChange: onEdgesChange, onConnect: onConnect, nodeTypes: nodeTypes, fitView: true },
            react_1.default.createElement("div", { id: "download-image" }),
            react_1.default.createElement(reactflow_1.Background, { className: " transition-colors duration-500 dark:bg-slate-800" }),
            react_1.default.createElement(reactflow_1.Controls, null,
                react_1.default.createElement(reactflow_1.ControlButton, null,
                    react_1.default.createElement(DownloadButton_1.default, null))))));
}
exports.default = Flow;
//# sourceMappingURL=Flow.js.map