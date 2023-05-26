//-----IMPORTED FILES/MODULES
import { SchemaStore } from '@/store/schemaStore';
import { Edge, DataNode } from '@/Types';

//hard-coded x & y positioning of each node in the canvas
export default function createNodes(schemaObject: SchemaStore, edges: Edge[]): DataNode[] {
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
  // renders each table on the React Flow schema canvas
  const nodes: DataNode[] = [];
  let i = 0;

  for (const tableKey in schemaObject) {
    //tableKey is name of the table
    const columnData = schemaObject[tableKey];

    nodes.push({
      id: tableKey,
      type: 'table',
      position: nodePositions[i],
      data: { table: [tableKey, columnData], edges },
    });
    i = (i + 1) % 17;
  }
  return nodes;
}
