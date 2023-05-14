/// <reference types="react" />
type RowData = {
    [key: string]: string | number;
};
export default function DataTableNodeColumn({ row, id, deleteRow, index, PK }: {
    row: RowData;
    id: string | number;
    deleteRow: (rowData: RowData, index: number, id: string, PK: {}) => void;
    index: number;
}): JSX.Element;
export {};
//# sourceMappingURL=DataTableNodeColumn.d.ts.map