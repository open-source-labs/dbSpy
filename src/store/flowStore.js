//
// State Management for React Flow
//

import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

let flowStore = (set, get) => ({
  edges: [],
  setEdges: (eds) => set((state) => ({ ...state, edges: eds })),
  nodes: [],
  setNodes: (nds) => set((state) => ({ ...state, nodes: nds })),

  //functions
  onNodesChange: (changes) =>
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    }),

  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
    }),

  onConnect: (connection) =>
    set({
      edges: addEdge(connection, get().edges),
    }),
});

// devtools for logging?
flowStore = devtools(flowStore);
const useFlowStore = create(flowStore);

export default useFlowStore;
