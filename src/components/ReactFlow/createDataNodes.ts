import { Edge, DataNode, DataStore } from '@/Types';


//hard-coded xy positioning of each node in the canvas

export default function createDataNodes(dataObject: DataStore, edges: Edge[]): DataNode[] {
  const nodePositions = [
    { x: 1000, y: 400 },
    { x: 1000, y: 0 },
    { x: 0, y: 600 },
    { x: 0, y: 0 },
    { x: 2500, y: 200 },
    { x: 0, y: 200 },
    { x: 2000, y: 800 },
    { x: 0, y: 400 },
    { x: 0, y: 800 },
    { x: 1000, y: 800 },
    { x: 0, y: 1050 },
  ];
  // renders each table on the React Flow canvas
  const nodes: DataNode[] = [];
  let i = 0;
  //console.log("dataObject", dataObject)
  for (const tableKey in dataObject) {
    const rowData = dataObject[tableKey];


    nodes.push({
      id: tableKey,
      type: 'table',

      position: nodePositions[i],
      data: { table: [tableKey, rowData], edges }, 
    });
    i = (i + 1) % 17;
  }
 //console.log(nodes)
  return nodes;
}


