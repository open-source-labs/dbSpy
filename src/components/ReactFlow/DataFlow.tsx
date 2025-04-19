//-----IMPORTED FILES/MODULES
import useFlowStore from '../../store/flowStore';
import useDataStore from '../../store/dataStore';
import { DataStore, Edge } from '@/Types';
import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
import React from 'react';
import { useEffect } from 'react';
import ReactFlow, {
  Controls,
  ControlButton,
  Background,
  ReactFlowProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import DownloadButton from './DownloadButton';
import createDataEdges from './createDataEdges';
import createDataNodes from './createDataNodes';
import DataTableNode from './DataTableNode';
import useSettingsStore from '../../store/settingsStore';
//-----TYPES
const nodeTypes = {
  table: DataTableNode,
};

//React Flow canvas for DATA TABLES
export default function DataFlow(): JSX.Element {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);
  const { dataStore } = useDataStore((state) => state);
  const { schemaStore } = useSchemaStore((state) => state);
  const { darkMode } = useSettingsStore((state) => state);

  // re-render every time dataStore updates
  useEffect(() => {
    reRender(dataStore, schemaStore);
  }, [dataStore, schemaStore]);

  function reRender(dataStore: DataStore, schemaStore: SchemaStore): void {
    if (!dataStore || !Object.keys(dataStore).length) return;
    const initialEdges = createDataEdges(schemaStore);
    setEdges(initialEdges);
    const initialNodes = createDataNodes(dataStore, initialEdges);
    setNodes(initialNodes);
  }

  // function for highlighting the edges associated with the current node - db 7.0
  const handleNodeClick = (event: any, node: ReactFlowProps) => {
    // Find edges connected to the clicked node and update their selected property using map method
    const updatedEdges = edges.map((edge) => {
      // below two lines are set up to be able to change the edge color if the darkMode state changes.
      // Not currently being utalized.
      let hlColor;
      darkMode === true ? (hlColor = '#fedd0a') : (hlColor = '#fedd0a');
      // The below condition checks to see if the selected node is either the source or the target of the current node in the edges array.
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
      //if the current edge is not associated with the node then return this styling.
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
    // pass in new edges array with altered stylings into setter function to update the state
    setEdges(updatedEdges);
  };

  // renders React Flow canvas
  return (
    <div className="flow" style={{ height: '98%', width: '100%', marginTop: '50px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick} // dbSpy 7.0
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
