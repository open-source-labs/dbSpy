const createInitialNodes = (schemaObject, edges) => {
  const nodes = Object.entries(schemaObject).map((table, index) => {
    return {
      id: table[0],
      type: 'table',
      position: { x: 0 + index * 125, y: 0 + index * 125 }, // got to figure out how to lay out the positions better
      data: { table, edges },
    };
  });
  return nodes;
};

export default createInitialNodes;
