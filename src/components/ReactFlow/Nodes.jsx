//creates a map of initial nodes to provide to Flow
//currently each next node's initial position is set to 125px down and right from the last node
const createInitialNodes = (schemaObject, edges) => {
  const nodePositions = [
    { x: 0, y: 0 },
    { x: 500, y: 0 },
    { x: 0, y: 350 },
    { x: 500, y: 350 },
    { x: 0, y: 700 },
    { x: 500, y: 700 },
    { x: 0, y: 1050 },
    { x: 500, y: 1050 },
    { x: 0, y: 1400 },
    { x: 500, y: 1400 },
    { x: 0, y: 1750 },
    { x: 500, y: 1750 },
    { x: 0, y: 2100 },
    { x: 500, y: 2100 },
    { x: 0, y: 2450 },
    { x: 500, y: 2450 },
    { x: 0, y: 2450 },
  ];
  const nodes = Object.entries(schemaObject).map((table, index) => {
    console.log('SCHEMA OBJECT: ', schemaObject);
    return {
      id: table[0],
      type: 'table',
      position: nodePositions[index],
      data: { table, edges },
    };
  });
  return nodes;
};

export default createInitialNodes;
