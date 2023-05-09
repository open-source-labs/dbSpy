import useFlowStore from '../../store/flowStore';
import useDataStore from '../../store/dataStore';
import { DataStore } from '@/Types'
import useSchemaStore from '../../store/schemaStore';
import React from 'react';
import { useEffect } from 'react';
import ReactFlow, { Controls, ControlButton, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import DownloadButton from './DownloadButton';
import createDataEdges from './createDataEdges';
import createDataNodes from './createDataNodes';
import DataTableNode from './DataTableNode';

const nodeTypes = {
  table: DataTableNode,
};

export default function DataFlow() {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);
  const { dataStore } = useDataStore(((state) => state))
  const { schemaStore } = useSchemaStore((state) => state);

  //console.log(dataStore)

  // re-render every time dataStore updates
  
  useEffect(() => {  
    reRender(dataStore);
  }, [dataStore/*, schemaStore*/]);

  function reRender(dataStore: DataStore) {
    if (!dataStore || !Object.keys(dataStore).length) return;
    const initialEdges = createDataEdges(schemaStore);
    setEdges(initialEdges);
    const initialNodes = createDataNodes(dataStore, initialEdges);
    setNodes(initialNodes);
  }
  //console.log('nodes in dataFlow',nodes) //schema info!!! why???
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

