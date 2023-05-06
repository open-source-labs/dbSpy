// creates an array of all edges in the schema
import { SchemaStore } from '../../store/schemaStore';
import { Edge } from '@/Types';

// export type Edge = {
//   id: string;
//   source: string;
//   sourceHandle: string;
//   target: string;
//   targetHandle: string;
//   animated: boolean;
//   label: string;
//   style: { strokeWidth: number; stroke: string };
//   markerEnd: {
//     type: string;
//     orient: string;
//     width: number;
//     height: number;
//     color: string;
//   };
// }; postgres

export default function createDataEdges(schemaObject: SchemaStore) {

  const edges: Edge[] = [];
  for (const tableKey in schemaObject) {
    const table = schemaObject[tableKey];

    for (const rowKey in table) {
      const row = table[rowKey];
  
      if (row.IsForeignKey) {
      
        if (row.References[0].ReferencesTableName || row.References[0].PrimaryKeyTableName) {
          edges.push({
            id: `${row.References[0].ReferencesTableName}-to-${row.References[0].PrimaryKeyTableName}`,
            source: row.References[0].ReferencesTableName.slice(7),
            sourceHandle: row.References[0].ReferencesPropertyName,
            target: row.References[0].PrimaryKeyTableName.slice(7),
            targetHandle: row.References[0].PrimaryKeyName,
            animated: true,
            label: `${row.References[0].ReferencesPropertyName}-to-${row.References[0].PrimaryKeyName}`,
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
  }
  return edges;
}
