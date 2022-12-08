import useFlowStore from '../../store/flowStore';
import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
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
import createEdges from './createEdges';
import createNodes from './createNodes';

const nodeTypes = {
  table: TableNode,
};

export default function Flow() {
  // set up states for nodes and edges
  const { edges, setEdges, nodes, setNodes, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore((state) => state);
  const { schemaStore } = useSchemaStore((state) => state);
  // re-render every time schemaStore updates
  // useSchemaStore.subscribe((state) => state.schemaStore, reRender);

  function reRender(schemaStore: SchemaStore) {
    console.log('rerendering-------------------------------------------------');
    if (!schemaStore || !Object.keys(schemaStore).length) return;
    console.log('initializing edges');
    const initialEdges = createEdges(schemaStore);
    console.log('setting initial edges', initialEdges);
    setEdges(initialEdges);
    console.log('init nodes');
    const initialNodes = createNodes(schemaStore, initialEdges);
    console.log('setting nodes');
    setNodes(initialNodes);
    console.log('nodes set');
  }

  useEffect(() => {
    reRender(schemaStore);
  }, [schemaStore]);

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
