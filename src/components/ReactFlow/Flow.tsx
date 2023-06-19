import useFlowStore from '../../store/flowStore';
import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
import React, { useEffect } from 'react';
import ReactFlow, { Controls, ControlButton, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import DownloadButton from './DownloadButton';
import TableNode from './TableNode';
import createEdges from './createEdges';
import createNodes from './createNodes';

const nodeTypes = {
  table: TableNode,
};

export default function Flow(): JSX.Element {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } = useFlowStore((state) => state);
  const { schemaStore } = useSchemaStore((state) => state);
  
  // re-render every time schemaStore updates

  useEffect(() => {
    reRender(schemaStore);
  }, [schemaStore]);

  function reRender(schemaStore: SchemaStore) {
    if (!schemaStore || !Object.keys(schemaStore).length) return;
    const initialEdges = createEdges(schemaStore);
    setEdges(initialEdges);
    const initialNodes = createNodes(schemaStore, initialEdges);
    setNodes(initialNodes);
  }

  console.log('onNodesChange: ', onNodesChange)

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
