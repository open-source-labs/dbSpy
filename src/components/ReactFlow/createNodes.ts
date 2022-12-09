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
  // renders each table on the React Flow canvas
  const nodes: Node[] = [];
  let i = 0;
  for (const tableKey in schemaObject) {
    const columnData = schemaObject[tableKey];
    nodes.push({
      id: tableKey,
      type: 'table',
      position: nodePositions[i],
      // position: {x: Math.random() * window.innerWidth, y: Math.random() * window.innerWidth},
      data: { table: [tableKey, columnData], edges },
    });
    i = (i + 1) % 17;
  }
  return nodes;
}
