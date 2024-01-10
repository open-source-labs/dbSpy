import useFlowStore from '../../store/flowStore';
import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
import React, { useEffect } from 'react';
import ReactFlow, { Controls, ControlButton, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import DownloadButton from './DownloadButton';
import TableNode from './TableNode';
import createEdges from './createEdges';
import createNodes from './createNodes';
import useSettingsStore from '../../store/settingsStore';

const nodeTypes = {
  table: TableNode,
};

export default function Flow(): JSX.Element {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);
  const { darkMode } = useSettingsStore((state) => state);
  const { schemaStore } = useSchemaStore((state) => state);

  // re-render every time schemaStore updates

  useEffect(() => {
    console.log('Trigger useEffect to rerender...');
    reRender(schemaStore);
  }, [schemaStore]);

  function reRender(schemaStore: SchemaStore) {
    console.log('Rerender...');
    if (!schemaStore || !Object.keys(schemaStore).length) return;
    const initialEdges = createEdges(schemaStore);
    console.log('initialEdges', initialEdges);
    setEdges(initialEdges);
    const initialNodes = createNodes(schemaStore, initialEdges);
    setNodes(initialNodes);
  }
  // function for highlighting the edges associated with the current node - db 7.0
  const handleNodeClick = (event, node) => {
    // Find edges connected to the clicked node and update their selected property
    //console.log('this is the event', event);
    console.log('these are the nodes', nodes);
    const updatedEdges = edges.map((edge) => {
      let hlColor;
      darkMode === true ? (hlColor = '#fedd0a') : (hlColor = '#fedd0a');
      if (edge.source === node.id || edge.target === node.id) {
        return {
          ...edge,
          type: 'smoothstep',
          style: {
            //strokeWidth: 2,
            ...edge.style,
            stroke: hlColor,
          },
          markerEnd: {
            ...edge.markerEnd,
            color: hlColor,
          },
        };
      }
      return {
        ...edge,
        type: 'smoothstep',
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
    <div className="flow" style={{ height: '98%', width: '100%', zIndex: 0 }}>
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
