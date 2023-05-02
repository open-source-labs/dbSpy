import { DataStore } from '@/store/dataStore';
import { Edge } from './createDataEdges';
import { ColumnDataForDataTable} from '../../Types';

type Node = {
  id: string;
  type: 'table';
  position: { x: number; y: number };
  data: {
    table: TableTuple;
    edges: Edge[];
  };
};
type TableTuple = [TableKey: string, ColumnData: { [ColumnName: string]: ColumnDataForDataTable; }];

//hard-coded xy positioning of each node in the canvas

export default function createDataNodes(dataObject: DataStore, edges: Edge[]): Node[] {
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
  return nodes;
}


