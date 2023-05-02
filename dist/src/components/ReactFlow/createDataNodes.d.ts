import { DataStore } from '@/store/dataStore';
import { Edge } from './createDataEdges';
import { ColumnDataForDataTable } from '../../Types';
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
    [ColumnName: string]: ColumnDataForDataTable;
}];
export default function createDataNodes(dataObject: DataStore, edges: Edge[]): Node[];
export {};
//# sourceMappingURL=createDataNodes.d.ts.map