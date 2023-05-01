// creates an array of all edges in the schema
import { SchemaStore } from '../../store/schemaStore';
import { DataStore } from '../../store/dataStore';

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

export default function createDataEdges(dataObject: DataStore, schemaObject: SchemaStore) {
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
        console.log("references", row.References[0][0])
        // edges.push({key:'hi'})
        edges.push({
          id: `${row.References[0][0].ReferencesTableName}-to-${row.References[0][0].PrimaryKeyTableName}`,
          
          source: row.References[0][0].ReferencesTableName.slice(7),
          sourceHandle: row.References[0][0].ReferencesPropertyName,
          target: row.References[0][0].PrimaryKeyTableName.slice(7),
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
  console.log('edges',edges)
  return edges;
}

// import useSchemaStore, { SchemaStore } from '../../store/schemaStore';
// import { DataStore } from '../../store/dataStore';

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
// };

// export default function createDataEdges(dataObject: DataStore, schemaObject: SchemaStore) {
//   console.log("inside createDataEdges file");
//   console.log('schemaObject', schemaObject);
//   console.log('dataObject', dataObject);
  

//   let whereEdgeStarts: [string, string] = ["table name", "initial starting point"];
//   let whereEdgeEnds: [string, string] = ["table name", "initial ending point"];

//   const edgeInfoArray:[] = []
//   for (const key in schemaObject) {
//     const eachTable = schemaObject[key];
//     const tableName = key;
//     for (const key in eachTable) {
//       const eachTableKey = eachTable[key];
//       if (eachTableKey.IsForeignKey === true) {
//         console.log("true here")
//         whereEdgeStarts[0] = tableName;
//         whereEdgeStarts[1] = key;
//         edgeInfoArray.push([whereEdgeStarts[0], whereEdgeStarts[1]])
//       }
//       if (eachTableKey.IsPrimaryKey === true) {
//         whereEdgeEnds[0] = tableName;
//         whereEdgeEnds[1] = key;
//         edgeInfoArray.push([whereEdgeEnds[0], whereEdgeEnds[1]])
//       }
//     }
//   }
//   console.log(edgeInfoArray);

//   const edges: Edge[] = [];

//   edgeInfoArray.forEach((eachEdgeInfo: []) => {
//     console.log("eachEdgeInfo", eachEdgeInfo)
//     edges.push({
//     id: `${eachEdgeInfo[0]}-to-${eachEdgeInfo[0]}`,
//     source: eachEdgeInfo[0],
//     sourceHandle: eachEdgeInfo[1],
//     target: eachEdgeInfo[0],
//     targetHandle: eachEdgeInfo[1],
//     animated: true,
//     label: `${eachEdgeInfo[0]}-to-${eachEdgeInfo[0]}`,
//     style: {
//       strokeWidth: 2,
//       stroke: '#085c84',
//     },
//     markerEnd: {
//       type: 'arrowclosed',
//       orient: 'auto',
//       width: 20,
//       height: 20,
//       color: '#085c84',
//     },
//   });
//   })
  
//   console.log('edges',edges)
//   return edges;
// }
