//
// State Management for React Flow
//
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { FlowState } from '@/Types';

const useFlowStore = create<FlowState>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      edges: [],
      setEdges: (eds) =>
        set((state) => ({ ...state, edges: eds }), false, 'setEdges in /flowStore'),
      nodes: [],
      setNodes: (nds) =>
        set((state) => ({ ...state, nodes: nds }), false, 'setNodes in /flowStore'),

      onNodesChange: (changes) =>
        set(
          (state) => ({
            ...state,
            nodes: applyNodeChanges(changes, get().nodes),
          }),
          false,
          'onNodesChange in /flowStore'
        ),

      onEdgesChange: (changes) =>
        set(
          (state) => ({
            ...state,
            edges: applyEdgeChanges(changes, get().edges),
          }),
          false,
          'onEdgesChange in /flowStore'
        ),

      onConnect: (connection) =>
        set(
          (state) => ({
            ...state,
            edges: addEdge(connection, get().edges),
          }),
          false,
          'onConnect in /flowStore'
        ),
    }))
  )
);

export default useFlowStore;

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
