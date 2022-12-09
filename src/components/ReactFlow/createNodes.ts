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
    openAddColumnModal: () => void;
  };
};

type TableTuple = [TableKey: string, ColumnData: { [ColumnName: string]: ColumnSchema }];
//hard-coded xy positioning of each node in the canvas
export default function createNodes(
  schemaObject: SchemaStore,
  edges: Edge[],
  openAddColumnModal: () => void
): Node[] {
  let i = 0;
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
  for (const tableKey in schemaObject) {
    const columnData = schemaObject[tableKey];
    nodes.push({
      id: tableKey,
      type: 'table',
      position: nodePositions[i++ % 17],
      data: { table: [tableKey, columnData], edges, openAddColumnModal },
    });
  }
  return nodes;
}
