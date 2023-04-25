"use strict";
//
// State Management for React Flow
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const reactflow_1 = require("reactflow");
let flowStore = (set, get) => ({
    edges: [],
    setEdges: (eds) => set((state) => ({ ...state, edges: eds })),
    nodes: [],
    setNodes: (nds) => set((state) => ({ ...state, nodes: nds })),
    //functions
    onNodesChange: (changes) => set({
        nodes: (0, reactflow_1.applyNodeChanges)(changes, get().nodes),
    }),
    onEdgesChange: (changes) => set({
        edges: (0, reactflow_1.applyEdgeChanges)(changes, get().edges),
    }),
    onConnect: (connection) => set({
        edges: (0, reactflow_1.addEdge)(connection, get().edges),
    }),
});
// devtools for logging?
flowStore = (0, middleware_1.devtools)(flowStore);
const useFlowStore = (0, zustand_1.default)(flowStore);
exports.default = useFlowStore;
//# sourceMappingURL=flowStore.js.map