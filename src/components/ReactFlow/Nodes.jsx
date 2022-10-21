const createInitialNodes = (schemaObject, edges) => {
  const nodes = Object.entries(schemaObject).map((table, index) => {
    return {
      id: table[0],
      type: 'table',
      position: { x: 100 * index + 50, y: 100 }, // got to figure out how to lay out the positions better
      data: { table, edges },
    };
  });
  return nodes;
};

export default createInitialNodes;
