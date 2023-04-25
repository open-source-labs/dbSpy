import { SchemaStore } from '@/store/schemaStore';
import { Edge } from './createEdges';
import { ColumnSchema } from '../../Types';
type Node = {
    id: string;
    type: 'table';
    position: {
        x: number;
        y: number;
    };
    data: {
        table: TableTuple;
        edges: Edge[];
    };
};
type TableTuple = [TableKey: string, ColumnData: {
    [ColumnName: string]: ColumnSchema;
}];
export default function createNodes(schemaObject: SchemaStore, edges: Edge[]): Node[];
export {};
//# sourceMappingURL=createNodes.d.ts.map