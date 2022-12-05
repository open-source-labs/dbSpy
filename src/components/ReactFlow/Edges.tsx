// creates an array of all edges in the schema
import { ColumnSchema } from '@/Types';
export default function createInitialEdges(schemaObject) {
  const edges: {}[] = [];
  const allRows: ColumnSchema[] = [];
  const schemaVals = Object.values(schemaObject) as {}[];
  for (const table of schemaVals) {
    allRows.push(...Object.values(table));
  }
  allRows.forEach((row) => {
    if (row.IsForeignKey) {
      edges.push({
        id: `${row.References[0].ReferencesTableName}-to-${row.References[0].PrimaryKeyTableName}`,
        source: row.References[0].ReferencesTableName,
        sourceHandle: row.References[0].ReferencesPropertyName,
        target: row.References[0].PrimaryKeyTableName,
        targetHandle: row.References[0].PrimaryKeyName,
        animated: true,
        label: `${row.References[0].ReferencesPropertyName}-to-${row.References[0].PrimaryKeyName}`,
        style: {
          strokeWidth: 2,
          stroke: '#FF0072',
        },
        markerEnd: {
          type: 'arrowclosed',
          orient: 'auto',
          width: 20,
          height: 20,
          color: '#FF0072',
        },
      });
    }
  });
  return edges;
}
