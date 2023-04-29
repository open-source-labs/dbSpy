// creates an array of all edges in the schema
import { SchemaStore } from '../../store/schemaStore';

export type Edge = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  animated: boolean;
  label: string;
  style: { strokeWidth: number; stroke: string };
  markerEnd: {
    type: string;
    orient: string;
    width: number;
    height: number;
    color: string;
  };
};

export default function createEdges(schemaObject: SchemaStore) {
  //console.log("i am in createEages file")
  const edges: Edge[] = [];
  for (const tableKey in schemaObject) {
    const table = schemaObject[tableKey];
    //console.log('const table', table)
    //console.log('what is this',)
    for (const rowKey in table) {
      const row = table[rowKey];
      //console.log("row", row)
      if (row.IsForeignKey) {
        //console.log("references", row.References[0][0])
        // edges.push({key:'hi'})
        edges.push({
          id: `${row.References[0][0].ReferencesTableName}-to-${row.References[0][0].PrimaryKeyTableName}`,
          
          source: row.References[0][0].ReferencesTableName,
          sourceHandle: row.References[0][0].ReferencesPropertyName,
          target: row.References[0][0].PrimaryKeyTableName,
          targetHandle: row.References[0][0].PrimaryKeyName,
          animated: true,
          label: `${row.References[0][0].ReferencesPropertyName}-to-${row.References[0][0].PrimaryKeyName}`,
          style: {
            strokeWidth: 2,
            stroke: '#085c84',
          },
          markerEnd: {
            type: 'arrowclosed',
            orient: 'auto',
            width: 20,
            height: 20,
            color: '#085c84',
          },
        });
      }
    }
  }
  //console.log('edges',edges)
  return edges;
}
