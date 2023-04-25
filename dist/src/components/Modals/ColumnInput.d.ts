/// <reference types="react" />
import { SQLDataType, ColumnData } from '../../Types';
type ColumnInputProps = {
    index: number;
    deleteColumn: (index: number) => void;
    handleColumnChange: (index: number, property: keyof ColumnData, value: string | boolean) => void;
    name: string;
    type: SQLDataType;
    isNullable: boolean;
    isPrimary: boolean;
    defaultValue: string | null;
    columnCount: number;
    mode: 'table' | 'column';
};
declare function ColumnInput({ index, deleteColumn, handleColumnChange, name, type, isNullable, isPrimary, defaultValue, columnCount, mode, }: ColumnInputProps): JSX.Element;
export default ColumnInput;
//# sourceMappingURL=ColumnInput.d.ts.map