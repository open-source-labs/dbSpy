import { SchemaStore } from '@/store/schemaStore';
import { Edge } from './createEdges';
import { ColumnSchema } from '../../Types';

type Node = {
  id: string;
  type: 'table';
  position: { x: number; y: number };
  data: {
    table: TableTuple;
    edges: Edge[];
  };
};
type TableTuple = [TableKey: string, ColumnData: { [ColumnName: string]: ColumnSchema }];
//hard-coded xy positioning of each node in the canvas
export default function createNodes(schemaObject: SchemaStore, edges: Edge[]): Node[] {
  console.log('i am in createNodes file')
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
  const nodes: Node[] = [];
  let i = 0;
  for (const tableKey in schemaObject) {
    //tableKey is name of the table
    const columnData = schemaObject[tableKey]; //obj of obj
    //console.log("here", tableKey, columnData)
    //console.log("edges", edges) //edges are coming from createEdges file
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
