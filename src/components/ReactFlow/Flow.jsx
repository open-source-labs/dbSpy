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


function Flow() {
  // // set up states for nodes and edges
  const {edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect} = useFlowStore(state=>state);
  
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
        <Background className=" dark:bg-slate-800 transition-colors duration-500"/>
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
