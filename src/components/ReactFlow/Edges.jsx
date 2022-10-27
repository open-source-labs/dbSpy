import { FaThLarge } from "react-icons/fa";

//creates edges array between table nodes based on the input schema object provided from state, array is provided to Flow as its initial edges
const createInitialEdges = (schemaObject) => {
  const edges = [];
  const allRows = [];
  const schemaVals = Object.values(schemaObject);
  for (const table of schemaVals) {
    allRows.push(...Object.values(table));
  }
  allRows.forEach((row) => {
    if (row.IsForeignKey) {
      console.log('row in edges.jsx: ', row);
      edges.push({
        id: `${row.References[0].ReferencesTableName}-to-${row.References[0].PrimaryKeyTableName}`,
        source: row.References[0].ReferencesTableName,
        sourceHandle: row.References[0].ReferencesPropertyName,
        target: row.References[0].PrimaryKeyTableName,
        targetHandle: row.References[0].PrimaryKeyName,
        animated: true,
        labelBg: false,
        label: `${row.References[0].ReferencesPropertyName}-to-${row.References[0].PrimaryKeyName}`,
        // labelStyle: {fill: 'red', fontWeight: 700 },
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
        smoothstep: {
          borderRadius: 40,
        },
        className: 'fill-[red]',
      });
    }
  });
  return edges;
};

export default createInitialEdges;
