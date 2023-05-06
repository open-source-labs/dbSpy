// creates an array of all edges in the schema
import { SchemaStore } from '../../store/schemaStore';
// import { Edge } from '@/Types';

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
  const edges: Edge[] = [];
  for (const tableKey in schemaObject) {
    const table = schemaObject[tableKey];
    for (const rowKey in table) {
      const row = table[rowKey];
      if (row.IsForeignKey) {
        edges.push({
          id: `${row.References[0].ReferencesTableName}-to-${row.References[0].PrimaryKeyTableName}`,
          target: row.References[0].ReferencesTableName,
          targetHandle: row.References[0].ReferencesPropertyName,
          source: row.References[0].PrimaryKeyTableName,
          sourceHandle: row.References[0].PrimaryKeyName,
          animated: true,
          label: `${row.References[0].PrimaryKeyName}-to-${row.References[0].ReferencesPropertyName}`,
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
  //console.log('edges: ', edges)
  return edges;
}
