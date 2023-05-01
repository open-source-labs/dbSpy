import { SchemaStore } from '@/store/schemaStore';
import { SchemaObject } from '@/Types';
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

  console.log("inside createDataEdges file");
  console.log('schemaObject', schemaObject);
  console.log('dataObject', dataObject);

  // let whereEdgeStarts: [string, string] = ["table name", "initial starting point"]
  // let whereEdgeEnds: [string, string] = ["table name", "initial ending point"]

  // for (const key in schemaObject) {
  //   const eachTable = schemaObject[key]
  //   const tableName = key
  //   for (const key in eachTable) {
  //     const eachTableKey = eachTable[key]
  //     if (eachTableKey.IsForeignKey === true) {
  //       whereEdgeStarts[0] = tableName
  //       whereEdgeStarts[1] = key
  //     }
  //     if (eachTableKey.IsPrimaryKey === true) {
  //       whereEdgeEnds[0] = tableName
  //       whereEdgeEnds[1] = key
  //      }
  //    }
  //  }
  // console.log(whereEdgeEnds, whereEdgeStarts)

  // const edges: Edge[] = [];

  // edges.push({
  //         id: `${whereEdgeStarts[0]}-to-${whereEdgeEnds[0]}`,
  //         source: whereEdgeStarts[0],
  //         sourceHandle: whereEdgeStarts[1],
  //         target: whereEdgeEnds[0],
  //         targetHandle: whereEdgeEnds[1],
  //         animated: true,
  //         label:  `${whereEdgeStarts[0]}-to-${whereEdgeEnds[0]}`,
  //         style: {
  //           strokeWidth: 2,
  //           stroke: '#085c84',
  //         },
  //         markerEnd: {
  //           type: 'arrowclosed',
  //           orient: 'auto',
  //           width: 20,
  //           height: 20,
  //           color: '#085c84',
  //         },
  //       });
  //   return edges;
      }


