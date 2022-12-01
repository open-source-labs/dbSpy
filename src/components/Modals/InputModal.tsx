import React, { useState } from 'react';
import { SQLDataType, ColumnData } from '../../Types';
import ColumnInput from './ColumnInput';
import useSchemaStore from '../../store/schemaStore';

type InputModalProps = {
  closeInputModal: () => void;
};

type TableData = {
  tableName: string;
  columns: ColumnData[];
};

// TODO: ADD FORM VALIDATION

export default function InputModal({ closeInputModal }: InputModalProps) {
  const initialTable: TableData = {
    tableName: 'untitled_table',
    columns: [
      {
        name: 'id',
        type: 'AUTOINCREMENT',
        isNullable: false,
        isPrimary: true,
        defaultValue: null,
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        isNullable: false,
        isPrimary: false,
        defaultValue: 'NOW()',
      },
    ],
  };

  const [tableData, setTableData] = useState(initialTable);

  const newColumn: ColumnData = {
    name: `column_${tableData.columns.length + 1}`,
    type: 'VARCHAR(255)',
    isNullable: false,
    isPrimary: false,
    defaultValue: null,
  };

  const { addTableSchema, addColumnSchema } = useSchemaStore((state) => state);

  const onSubmit = () => {
    addTableSchema(tableData.tableName);
    tableData.columns.forEach((columnData) =>
      addColumnSchema(tableData.tableName, columnData)
    );
  };

  const addColumn = () => {
    setTableData((prevData) => {
      prevData.columns.push(newColumn);
      return { ...prevData };
    });
  };

  const deleteColumn = (index: number) => {
    setTableData((prevData) => {
      prevData.columns.splice(index, 1);
      return { ...prevData };
    });
  };

  const onColumnChange = (
    index: number,
    property: keyof ColumnData,
    value: string | boolean
  ) => {
    setTableData((prevData) => {
      // TODO: LEARN WHY TS IS YELLING
      prevData.columns[index][property] = value;
      return { ...prevData };
    });
  };

  const columnInputs = tableData.columns.map((col, index) => (
    <ColumnInput
      key={`column-${index}`}
      index={index}
      deleteColumn={deleteColumn}
      onColumnChange={onColumnChange}
      name={col.name}
      type={col.type}
      isNullable={col.isNullable}
      isPrimary={col.isPrimary}
      defaultValue={col.defaultValue}
    />
  ));

  return (
    <div id="inputModal" className="inputModal">
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
          closeInputModal();
        }}
        className="modal-content w-[30%] min-w-[300px] max-w-[550px] flex-col rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]"
      >
        <button type="button" onClick={addColumn}>
          Add Column
        </button>
        <label
          htmlFor="table-modal-name"
          className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]"
        >
          Table Name
        </label>
        <input
          id="table-modal-name"
          className="mb-4 w-[300px]"
          value={tableData.tableName}
          onChange={(e) =>
            setTableData((prevData) => ({ ...prevData, tableName: e.target.value }))
          }
        />
        {columnInputs}
        <div className="mx-auto flex w-[50%] max-w-[200px] justify-between">
          <button
            type="button"
            className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
            onClick={closeInputModal}
          >
            Cancel
          </button>
          <button className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]">
            Create Table
          </button>
        </div>
      </form>
    </div>
  );
}
