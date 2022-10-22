import useFlowStore from '../../store/flowStore';
import React from 'react';
import { useState, useCallback, useEffect } from 'react';
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


const nodeTypes = {
  table: TableNode,
};

function Flow(props) {
  // // set up states for nodes and edges
  const edges = useFlowStore((state) => state.edges);
  const setEdges = useFlowStore((state) => state.setEdges);
  const nodes = useFlowStore((state) => state.nodes);
  const setNodes = useFlowStore((state) => state.setNodes);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);
  setEdges(props.eds);
  setNodes(props.nds);
  
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
        <Background />
        <Controls>
          <ControlButton>
            <DownloadButton />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}

export default Flow;
