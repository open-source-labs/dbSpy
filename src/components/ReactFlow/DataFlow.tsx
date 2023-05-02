import useFlowStore from '../../store/flowStore';
import useDataStore, { DataStore } from '../../store/dataStore';
import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
import React from 'react';
import { useEffect, useCallback } from 'react';
import ReactFlow, {
  Controls,
  ControlButton,
  // Node,
  // addEdge,
  Background,
  // Edge,
  // Connection,
  // useNodesState, useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import DownloadButton from './DownloadButton';
import TableNode from './TableNode';
import createDataEdges from './createDataEdges';
import createDataNodes from './createDataNodes';
import schemaStore from '../../store/schemaStore';
import DataTableNode from './DataTableNode';

const nodeTypes = {
  table: DataTableNode,
  // table: TableNode,
};

export default function DataFlow() {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);
  const { dataStore } = useDataStore(((state) => state))
  const { schemaStore } = useSchemaStore((state) => state);
  //need to finish build dataStore###################
  // re-render every time dataStore updates

  useEffect(() => {  
    reRender(dataStore);
    // reactFlowInstance.fitView();
  }, [dataStore, schemaStore]);

  function reRender(dataStore: DataStore) {
    if (!dataStore || !Object.keys(dataStore).length) return;
    const initialEdges = createDataEdges(dataStore,schemaStore);
    setEdges(initialEdges);
    const initialNodes = createDataNodes(dataStore, initialEdges);
    console.log('dataStore1', dataStore)
    console.log('initialNodes', initialNodes)
    setNodes(initialNodes);
  }


  // console.log('dataStore2', dataStore)
  //console.log('nodes from dataFlow (DATA INFO)', nodes) //it's passing schema... and where this came from? why???
  // renders React Flow canvas
  return (
    <div className="flow" style={{ height: '80%', width: '95%' }}>
       I AM DATA FLOW!!!!!
      <ReactFlow
      //this chunk (tables) is not rendering!!
        nodes={nodes}
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        
        //
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

