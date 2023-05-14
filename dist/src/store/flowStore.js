"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// State Management for React Flow
//
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const reactflow_1 = require("reactflow");
const useFlowStore = (0, zustand_1.default)()((0, middleware_1.subscribeWithSelector)((0, middleware_1.devtools)((set, get) => ({
    edges: [],
    setEdges: (eds) => set((state) => ({ ...state, edges: eds })),
    nodes: [],
    setNodes: (nds) => set((state) => ({ ...state, nodes: nds })),
    onNodesChange: (changes) => set((state) => ({
        ...state,
        nodes: (0, reactflow_1.applyNodeChanges)(changes, get().nodes),
    })),
    onEdgesChange: (changes) => set((state) => ({
        ...state,
        edges: (0, reactflow_1.applyEdgeChanges)(changes, get().edges),
    })),
    onConnect: (connection) => set((state) => ({
        ...state,
        edges: (0, reactflow_1.addEdge)(connection, get().edges),
    }))
}))));
exports.default = useFlowStore;
// (set: any, get: any) => ({
//   edges: [],
//   setEdges: (eds: any) => set((state: any) => ({ ...state, edges: eds })),
//   nodes: [],
//   setNodes: (nds: any) => set((state: any) => ({ ...state, nodes: nds })),
//   //functions
//   onNodesChange: (changes: any) =>
//     set({
//       nodes: applyNodeChanges(changes, get().nodes),
//     }),
//   onEdgesChange: (changes: any) =>
//     set({
//       edges: applyEdgeChanges(changes, get().edges),
//     }),
//   onConnect: (connection: any) =>
//     set({
//       edges: addEdge(connection, get().edges),
//     }),
// });
// devtools for logging?
// flowStore = devtools(flowStore);
// const useFlowStore = create(flowStore);
//-------------------------------------------------------------------
// export type RowsOfData = [{
//   [key: string | number]: string | number,
// }];
// export type DataStore = {
//   [TableName: string]: RowsOfData[]
// }
// export type DataState = {
//   // DATA
//   dataStore: DataStore;
//   system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL';
//   history: DataStore[];
//   historyCounter: number;
// const useDataStore = create<DataState>()(
//   // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
//   subscribeWithSelector(
//     // devtools middleware allows use of Redux devtool in chrome
//     devtools(
//       // store function - 'get' parameter is basically a `this` alias when invoked
//       (set, _get) => ({
//         dataStore: {},
//         system: 'PostgreSQL',
//         history: [{}],
//         historyCounter: 0,
//         setSystem: (system: any) => set((state) => ({ ...state, system })),
//         setDataStore: (dataInfo) => set((state) => ({ ...state, dataStore: dataInfo })),
//       })
//     )
//   )
// );
//# sourceMappingURL=flowStore.js.map