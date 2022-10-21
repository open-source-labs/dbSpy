//access to schemaObject and initialEdges
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';

// generates table nodes based on Schema Object
// i would like to figure out a way to visually differentiate join tables

const createInitialNodes = () => {
  const schemaObject = useSchemaStore((state) => state.schemaStore);
  const edges = useFlowStore((state) => state.edges);
  const setNodes = useFlowStore((state) => state.setNodes);
  const nodes = Object.entries(schemaObject).map((table, index) => {
    return {
      id: table[0],
      type: 'table',
      position: { x: 0 + index * 125, y: 0 + index * 125 }, // got to figure out how to lay out the positions better
      data: { table, edges },
    };
  });
  setNodes(nodes);
};

// setInitialNodes(initialNodes);
export default createInitialNodes;
