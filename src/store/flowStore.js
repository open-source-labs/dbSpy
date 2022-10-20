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



const flowStore = (set, get) => ({
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

// import create from 'zustand';
// import {
//   Connection,
//   Edge,
//   EdgeChange,
//   Node,
//   NodeChange,
//   addEdge,
//   OnNodesChange,
//   OnEdgesChange,
//   OnConnect,
//   applyNodeChanges,
//   applyEdgeChanges,
// } from 'reactflow';

// import initialNodes from '../components/ReactFlow/Nodes.jsx';
// import initialEdges from '../components/ReactFlow/Edges.jsx';

// type RFState = {
//   nodes: Node[];
//   edges: Edge[];
//   onNodesChange: OnNodesChange;
//   onEdgesChange: OnEdgesChange;
//   onConnect: OnConnect;
// };

// // this is our useStore hook that we can use in our components to get parts of the store and call actions
// const useStore = create<RFState>((set, get) => ({
//   nodes: initialNodes,
//   edges: initialEdges,
// onNodesChange: (changes: NodeChange[]) => {
//   set({
//     nodes: applyNodeChanges(changes, get().nodes),
//   });
// },
// onEdgesChange: (changes: EdgeChange[]) => {
//   set({
//     edges: applyEdgeChanges(changes, get().edges),
//   });
// },
// onConnect: (connection: Connection) => {
//   set({
//     edges: addEdge(connection, get().edges),
//   });
//   },
// }));

// export default useStore;
