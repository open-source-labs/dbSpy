

//hard-coded xy positioning of each node in the canvas
export default function createInitialNodes(schemaObject, edges) {
  const nodePositions = [
    // { x: 0, y: 0 },
    // { x: 500, y: 0 },
    // { x: 0, y: 350 },
    // { x: 500, y: 350 },
    // { x: 0, y: 700 },
    // { x: 500, y: 700 },
    // { x: 0, y: 1050 },
    // { x: 500, y: 1050 },
    // { x: 0, y: 1400 },
    // { x: 500, y: 1400 },
    // { x: 0, y: 1750 },
    // { x: 500, y: 1750 },
    // { x: 0, y: 2100 },
    // { x: 500, y: 2100 },
    // { x: 0, y: 2450 },
    // { x: 500, y: 2450 },
    // { x: 0, y: 2450 },
    { x: 1000, y: 400 },
    { x: 1000, y: 0 },
    { x: 0, y: 600 },
    { x: 0, y: 0 },
    { x: 2500, y: 200 },
    { x: 0, y: 200},
    { x: 2000, y: 800 },
    { x: 0, y: 400},
    { x: 0, y: 800 },
    { x: 1000, y: 800 },
    { x: 0, y: 1050 },
  ];
  // renders each table on the React Flow canvas
  const nodes = Object.entries(schemaObject).map((table, index) => {
    console.log({ table, edges });
    return {
      id: table[0],
      type: 'table',
      position: nodePositions[index],
      // position: {x: Math.random() * window.innerWidth, y: Math.random() * window.innerWidth},
      data: { table, edges },
    };
  });
  return nodes;
}
