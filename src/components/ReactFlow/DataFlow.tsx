//-----IMPORTED FILES/MODULES
import useFlowStore from '../../store/flowStore';
import useDataStore from '../../store/dataStore';
import { DataStore, Edge } from '@/Types'
import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
import React from 'react';
import { useEffect } from 'react';
import ReactFlow, { Controls, ControlButton, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import DownloadButton from './DownloadButton';
import createDataEdges from './createDataEdges';
import createDataNodes from './createDataNodes';
import DataTableNode from './DataTableNode';

//-----TYPES
const nodeTypes = {
  table: DataTableNode,
};

//React Flow canvas for DATA TABLES
export default function DataFlow(): JSX.Element {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);
  const { dataStore } = useDataStore((state) => state)
  const { schemaStore } = useSchemaStore((state) => state);

  // re-render every time dataStore updates
  useEffect(() => {  
    reRender(dataStore, schemaStore);
  }, [dataStore, schemaStore]);

  function reRender(dataStore: DataStore, schemaStore: SchemaStore):void {
    if (!schemaStore || !Object.keys(schemaStore).length) return;
    const initialEdges = createDataEdges(schemaStore);
    setEdges(initialEdges);
    const initialNodes = createDataNodes(dataStore, initialEdges);
    setNodes(initialNodes);
  }
  
  // renders React Flow canvas
  return (
    <div className="flow" style={{ height: '80%', width: '95%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges} 
        onNodesChange={onNodesChange} 
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

