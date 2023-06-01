/// <reference types="react" />
type EachRow = {
    [key: string | number]: string | number | boolean | null;
};
type RowInputProps = {
    tableName: string | undefined;
    currentTable: EachRow[];
    handleRowChange: (index: number, value: string | boolean) => void;
    secondaryColumnNames: string[];
};
export default function RowInput({ tableName, currentTable, handleRowChange, secondaryColumnNames }: RowInputProps): JSX.Element;
export {};
//# sourceMappingURL=RowInput.d.ts.map