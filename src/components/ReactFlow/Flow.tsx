import useFlowStore from '../../store/flowStore';
import useSchemaStore from '../../store/schemaStore';
import React from 'react';
import { useEffect } from 'react';
import ReactFlow, {
  Controls,
  ControlButton,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import DownloadButton from './DownloadButton';
import TableNode from './TableNode';
import createInitialEdges from './Edges';
import createInitialNodes from './Nodes';

const nodeTypes = {
  table: TableNode,
};

export default function Flow() {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);

  // re-render every time schemaStore updates
  useSchemaStore.subscribe((state) => state.schemaStore, reRender);

  function reRender(schemaStore) {
    if (!Object.keys(schemaStore).length) return;
    const initialEdges = createInitialEdges(schemaStore);
    setEdges(initialEdges);
    const initialNodes = createInitialNodes(schemaStore, initialEdges);
    setNodes(initialNodes);
  }

  // renders React Flow canvas
  return (
    <div className="flow" style={{ height: '80%', width: '95%' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <div id="download-image"></div>
        <Background className=" transition-colors duration-500 dark:bg-slate-800" />
        <Controls>
          <ControlButton>
            <DownloadButton />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}
