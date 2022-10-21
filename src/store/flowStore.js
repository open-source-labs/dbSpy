//
// State Management for React Flow
//

//create the store for flow (ie. )
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  // Connection,
  // Edge,
  // EdgeChange,
  // Node,
  // NodeChange,
  addEdge,
  // OnNodesChange,
  // OnEdgesChange,
  // OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

let flowStore = (set, get) => ({
  edges: null,
  setEdges: (eds) => set((state) => ({ ...state, edges: eds })),
  nodes: null,
  setNodes: (nds) => set((state) => ({ ...state, nodes: nds })),
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
});

flowStore = devtools(flowStore);
// flowStore = persist(flowStore);
const useFlowStore = create(flowStore);

export default useFlowStore;
