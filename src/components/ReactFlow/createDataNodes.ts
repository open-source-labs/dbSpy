//-----IMPORTED FILES/MODULES
import { Edge, DataNode, DataStore } from '@/Types';

export default function createDataNodes(dataObject: DataStore, edges: Edge[]): DataNode[] {

  // renders each table on the React Flow data canvas
  const nodes: DataNode[] = [];
  
  // Arrows come from the top of tables with data. When the table tops are perfectly inline
  // and are connected to by the arrows, there is no curve to the arrow and it becomes
  // a straight line and harder to see. This gives the arrow a slight curve between inline tables.
  let offSetter: number = 1; 
  let x: number = 0;
  let y: number = 0;

  for (const tableName in dataObject) {
    const rowData = dataObject[tableName];

    nodes.push({
      id: tableName,
      type: 'table',
      position: {x, y},
      data: { table: [tableName, rowData], edges },
    });

    y += 500;
    if (y > 2100) {
      y = -5 * offSetter;
      x += 700;
      offSetter += 1;
    };
  };
  return nodes;
};


