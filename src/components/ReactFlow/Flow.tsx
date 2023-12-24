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
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);
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

  console.log('onNodesChange: ', onNodesChange);

  const handleNodeClick = (event, node) => {
    // Find edges connected to the clicked node and update their selected property
    const updatedEdges = edges.map((edge) => {
      if (edge.source === node.id || edge.target === node.id) {
        return {
          ...edge,
          type: 'smoothstep',
          style: {
            //strokeWidth: 2,
            ...edge.style,
            stroke: '#fedd0a',
          },
          markerEnd: {
            ...edge.markerEnd,
            color: '#fedd0a',
          },
        };
      }
      return {
        ...edge,
        type: 'bezier',
        style: {
          //strokeWidth: 2,
          ...edge.style,
          stroke: '#085c84',
        },
        markerEnd: {
          ...edge.markerEnd,
          color: '#085c84',
        },
      };
    });

    setEdges(updatedEdges);
  };

  // renders React Flow canvas
  return (
    <div className="flow" style={{ height: '92%', width: '98.2%', zIndex: 0 }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <div id="download-image"></div>
        <Background className=" transition-colors duration-500 dark:bg-black" />
        <Controls position="top-right">
          <ControlButton>
            <DownloadButton />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}
