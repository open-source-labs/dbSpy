/// <reference types="react" />
import { RowsOfData } from '@/Types';
type DataTableNodeColumnProp = {
    row: RowsOfData;
    id?: string | number;
    deleteRow: (rowData: RowsOfData, index: number, id: string | number) => void;
    index: number;
    PK: [string | number | null, Set<unknown> | null];
};
export default function DataTableNodeColumn({ row, id, deleteRow, index, PK }: DataTableNodeColumnProp): JSX.Element;
export {};
//# sourceMappingURL=DataTableNodeColumn.d.ts.map