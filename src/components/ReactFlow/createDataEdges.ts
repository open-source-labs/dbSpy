//-----IMPORTED FILES/MODULES
import { SchemaStore } from '../../store/schemaStore';
import { Edge } from '@/Types';

//----- Creates an array of all edges in the data view
export default function createDataEdges(schemaObject: SchemaStore): Edge[] {
  const edges: Edge[] = [];
  for (const tableKey in schemaObject) {
    const table = schemaObject[tableKey];

    for (const rowKey in table) {
      const row = table[rowKey];
  
      if (row.IsForeignKey) {

        if (row.References[0].ReferencesTableName || row.References[0].PrimaryKeyTableName) {
          edges.push({
          id: row.References[0].constraintName,
          source: row.References[0].ReferencesTableName,
          sourceHandle:  row.References[0].ReferencesPropertyName,
          target: row.References[0].PrimaryKeyTableName,
          targetHandle: row.References[0].PrimaryKeyName,
          animated: true,
          label: row.References[0].constraintName,
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
        };
      };
    };
  };
  return edges;
};
