import React, { ChangeEventHandler, useState } from 'react';
import { idText } from 'typescript';
import { nanoid } from 'nanoid';
import { SQLDataType } from '../../Types';
import RowInput from './RowInput';

type TableModalProps = {
  closeTableModal: () => void;
};

type TableData = {
  tableName: string;
  columns: ColumnData[];
};

export type ColumnData = {
  name: string;
  type: SQLDataType;
  isNullable: boolean;
  isPrimary: boolean;
  defaultValue?: string;
};

export default function TableModal({ closeTableModal }: TableModalProps) {
  const initialTable: TableData = {
    tableName: 'untitled_table',
    columns: [
      {
        name: 'id',
        type: 'AUTOINCREMENT',
        isNullable: false,
        isPrimary: true,
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

  const deleteRow = (index: number) => {
    setTableData((prevData) => {});
  };

  const onRowChange = (
    index: number,
    property: keyof ColumnData,
    value: string | boolean
  ) => {
    setTableData((prevData) => {
      prevData.columns[index][property] = value;
      return {
        ...prevData,
      };
    });
  };

  const rowInputs = tableData.columns.map((col, index) => (
    <RowInput
      key={`row-${index}`}
      index={index}
      deleteRow={deleteRow}
      onRowChange={onRowChange}
      name={col.name}
      type={col.type}
      isNullable={col.isNullable}
      isPrimary={col.isPrimary}
      defaultValue={col.defaultValue}
    />
  ));

  return (
    <div id="addTableModal" className="addTableModal">
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          console.log('table submitted');
          closeTableModal();
        }}
        className="modal-content w-[30%] min-w-[300px] max-w-[550px] flex-col rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]"
      >
        <label
          htmlFor="table-modal-name"
          className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]"
        >
          Table Name
        </label>
        <input id="table-modal-name" className="mb-4 w-[300px]" />
        {rowInputs}
        <div className="mx-auto flex w-[50%] max-w-[200px] justify-between">
          <button
            type="button"
            className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
            onClick={closeTableModal}
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
