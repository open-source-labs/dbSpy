import React, { useState } from 'react';
import { SQLDataType, ColumnData } from '../../Types';
import ColumnInput from './ColumnInput';
import useSchemaStore from '../../store/schemaStore';

type InputModalProps = {
  mode: 'table' | 'column';
  closeInputModal: () => void;
  tableNameProp?: string;
};

interface Column {
  name: string,
  type: any,
  isNullable: boolean,
  isPrimary: boolean,
  defaultValue: string | null;
  }

  type AddTableToDb = {
  newTableName: string;
  newColumns: Column[]
  };

// TODO: ADD FORM VALIDATION
// table or column name can have length <= 63

export default function InputModal({
  mode,
  closeInputModal,
  tableNameProp,
}: InputModalProps) {
  // TODO: separate state for table name and column data
  // TODO: FORCE USER TO CHOOSE ONE AND ONLY ONE COLUMN AS PK WHEN CREATING TABLE
  // AFTERWARDS, PK MAY NOT BE EDITED
  const initialTable: string = 'untitled_table';  //for adding new table
  const initialColumns: ColumnData[] = [
    {
      name: 'id',
      type: 'AUTO_INCREMENT',
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
  ];
  const additionalColumn: ColumnData[] = [
    {
      name: 'column_1',
      type: 'VARCHAR(255)',
      isNullable: false,
      isPrimary: false,
      defaultValue: null,
    },
  ];
  const [tableName, setTableName] = useState<string>(() => {
    if (!tableNameProp) return initialTable;
    else return tableNameProp;
  });
  const [columnData, setColumnData] = useState<ColumnData[]>(() => {
    if (mode === 'table') return initialColumns;
    else return additionalColumn;
  });

  // functions that check validity and add schema to the store
  const { addTableSchema, deleteTableSchema, addColumnSchema } = useSchemaStore(
    (state) => state
  );

  const handleSubmit = (): boolean => {
    // table must be added to schema first to enable column validity checks
    try {
      if (mode === 'table') {
        addTableSchema(tableName, columnData);
        const dataToSend: AddTableToDb = {
          newTableName: tableName,
          newColumns: columnData
          }

          //req to backend to save new table

          fetch('/api/sql/postgres/saveNewTable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(dataToSend)
          })
          .then((responseData)=> responseData.json())
          .then((parsedData)=> console.log(parsedData))
          console.log('tn:',tableName, 'cd:',columnData)
      }
      else if (mode === 'column') {
        addColumnSchema(tableName, columnData);  //same method as addRow for data table
      }

      return true;
    } catch (error) {
      window.alert(error);
      console.error(error);
      return false;
    }
  };

  const newColumn: ColumnData = {
    name: `column_${columnData.length + 1}`,
    type: 'VARCHAR(255)',
    isNullable: false,
    isPrimary: false,
    defaultValue: null,
  };

  const addColumn = () => { //addNewRow for data table
    setColumnData((prevColumns) => {
      prevColumns.push(newColumn);
      return [...prevColumns];
    });
  };

  const deleteColumn = (index: number) => {
    setColumnData((prevColumns) => {
      prevColumns.splice(index, 1);
      return [...prevColumns];
    });
  };

  const handleColumnChange = (
    index: number,
    property: keyof ColumnData,
    value: string | boolean
  ) => {
    setColumnData((prevColumns) => {
      // isPrimary is special. Only one column may be pk. Extra logic required
      if (property !== 'isPrimary') {
        // TODO: LEARN WHY TS IS YELLING
        prevColumns[index][property] = value;
        return [...prevColumns];
      }
      // Disables unchecking pk
      else if (!value) return prevColumns;
      else {
        // If checking new column, uncheck old pk
        for (const column of prevColumns) {
          column.isPrimary = false;
        }
        prevColumns[index].isPrimary = true;
        return [...prevColumns];
      }
    });
  };

  const columnInputs = columnData.map((col, index) => (
    <ColumnInput
      key={`column-${index}`}
      index={index}
      deleteColumn={deleteColumn}
      handleColumnChange={handleColumnChange}
      name={col.name}
      type={col.type}
      isNullable={col.isNullable}
      isPrimary={col.isPrimary}
      defaultValue={col.defaultValue}
      columnCount={columnData.length}
      mode={mode}
    />
  ));

  // console.log("columnData", columnData)

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
          {mode === 'table' ? (
            <>
              <label
                htmlFor="table-modal-name"
                className="  text-slate-900 dark:text-[#f8f4eb]"
              >
                Table Name
              </label>
              <input
                id="table-modal-name"
                value={tableName}
                required
                maxLength={63}
                onChange={(e) => setTableName(e.target.value.trim())}
              />
            </>
          ) : (
            <h1>{`Table Name: ${tableName}`}</h1>
          )}
        </div>
        <div className="column-header">
          <h1 className="  text-slate-900 dark:text-[#f8f4eb]">
            {mode === 'table' ? 'Columns' : 'New Columns'}
          </h1>
          <button
            type="button"
            className="  text-slate-900 dark:text-[#f8f4eb]"
            onClick={addColumn}
            data-testid="add-table-add-column"
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
            data-testid="modal-cancel"
          >
            Cancel
          </button>
          <button
            className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
            data-testid="modal-submit"
          >
            {mode === 'table' ? 'Create Table' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
