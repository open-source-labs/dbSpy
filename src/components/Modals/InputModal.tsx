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
// table or column name can have length <= 63

export default function InputModal({ closeInputModal }: InputModalProps) {
  // TODO: separate state for table name and column data
  // TODO: FORCE USER TO CHOOSE ONE AND ONLY ONE COLUMN AS PK WHEN CREATING TABLE
  // AFTERWARDS, PK MAY NOT BE EDITED
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

  // functions that check validity and add schema to the store
  const { addTableSchema, deleteTableSchema, addColumnSchema } = useSchemaStore(
    (state) => state
  );

  // TODO: set tablename to parent table when in column mode
  const [tableData, setTableData] = useState(initialTable);

  const newColumn: ColumnData = {
    name: `column_${tableData.columns.length + 1}`,
    type: 'VARCHAR(255)',
    isNullable: false,
    isPrimary: false,
    defaultValue: null,
  };

  const handleSubmit = (): boolean => {
    // table must be added to schema first to enable column validity checks
    try {
      addTableSchema(tableData.tableName, tableData.columns);
      return true;
    } catch (error) {
      console.error(error);
      window.alert(error);
      return false;
    }
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
    <div id="inputModal" className="input-modal">
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const isSuccessful: boolean = handleSubmit();
          if (isSuccessful) closeInputModal();
        }}
        className="modal-content  rounded-md  bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]"
      >
        <div className="table-name">
          <label
            htmlFor="table-modal-name"
            className="  text-slate-900 dark:text-[#f8f4eb]"
          >
            Table Name
          </label>
          <input
            id="table-modal-name"
            value={tableData.tableName}
            onChange={(e) =>
              setTableData((prevData) => ({
                ...prevData,
                tableName: e.target.value.trim(),
              }))
            }
          />
        </div>
        <div className="column-header">
          <h1 className="  text-slate-900 dark:text-[#f8f4eb]">Columns</h1>
          <button
            type="button"
            className="  text-slate-900 dark:text-[#f8f4eb]"
            onClick={addColumn}
          >
            Add Column
          </button>
        </div>
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
