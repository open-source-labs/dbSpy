// creates an array of all edges in the schema
import { ColumnSchema } from '@/Types';
export default function createInitialEdges(schemaObject) {
  const edges = [];
  const allRows: ColumnSchema[] = [];
  const schemaVals = Object.values(schemaObject);
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
        type: 'smoothstep',
        style: {
          stroke: '#4a7187',
          strokeWidth: 5,
        },
        markerEnd: {
          type: 'arrowclosed',
          orient: 'auto',
          height: 6,
          width: 6,
          color: '#4a7187',
        },
      });
    }
  });
  console.log('returning edges: ', edges);
  return edges;
}
