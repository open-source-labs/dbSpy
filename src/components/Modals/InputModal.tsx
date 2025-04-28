import React, { useState } from 'react';
import { SQLDataType, ColumnData } from '../../Types';
import ColumnInput from './ColumnInput';
import useSchemaStore from '../../store/schemaStore';
import useDataStore from '../../store/dataStore';
import useCredentialsStore from '../../store/credentialsStore';

//closeInputModal

type InputModalProps = {
  mode: 'table' | 'column';
  closeInputModal: () => void;
  tableNameProp?: string;
};

interface Column {
  name: string;
  type: any;
  isNullable: boolean;
  isPrimary: boolean;
  defaultValue: string | null;
}

type AddTableToDb = {
  tableName: string;
  newColumns: Column[];
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
  const { dbCredentials } = useCredentialsStore((state) => state);

  const { setSchemaStore } = useSchemaStore((state) => state);
  const { setDataStore } = useDataStore((state) => state);

  const initialTable: string = 'untitled_table'; //for adding new table
  const initialColumns: ColumnData[] = [
    {
      name: 'id',
      type: 'INT',
      isNullable: false,
      isPrimary: true,
      defaultValue: null,
    },
  ];
  const additionalColumn: ColumnData[] = [
    {
      name: 'column_1',
      type: 'VARCHAR(255)',
      isNullable: true,
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
    try {
      if (mode === 'table') {
        addTableSchema(tableName, columnData);
        const dataToSend: AddTableToDb = {
          tableName: tableName,
          newColumns: columnData,
        };
        //req to backend to save new table
        fetch(`./api/sql/${dbCredentials.db_type}/saveNewTable`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        })
          .then((responseData) => responseData.json())
          .then((parsedData) => {
            setSchemaStore(parsedData.schema);
            setDataStore(parsedData.data);
          });
      } else if (mode === 'column') {
        addColumnSchema(tableName, columnData);

        //new column data that will be sent in the post request body
        const dataToSend = {
          tableName: tableName,
          columnData: columnData,
        };
        //adds new column to the selected table
        fetch(`/api/sql/${dbCredentials.db_type}/addColumn`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
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
    isNullable: true,
    isPrimary: false,
    defaultValue: null,
  };

  const addColumn = () => {
    //addNewRow for data table
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
        (prevColumns[index][property] as string | boolean | null | SQLDataType) = value;
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

  return (
    <div id="inputModal" className="input-modal">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const isSuccessful: boolean = handleSubmit();
          if (isSuccessful) closeInputModal();
        }}
        className="modal-content relative z-10 w-full min-w-[400px] max-w-[600px] rounded-md bg-opacity-80 bg-gradient-to-b from-[#f8f4eb] to-transparent shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:from-accent dark:shadow-[0px_5px_10px_#1e293b]"
      >
        <div className="table-name">
          {mode === 'table' ? (
            <>
              <label
                htmlFor="table-modal-name"
                className="w-[100px] text-slate-900 dark:text-[#f8f4eb]"
              >
                Table Name:
              </label>
              <input
                id="table-modal-name"
                value={tableName}
                required
                maxLength={63}
                onChange={(e) =>
                  setTableName(
                    (dbCredentials.db_type === 'postgres'
                      ? e.target.value.toLowerCase().trim()
                      : e.target.value
                    ).trim()
                  )
                }
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
          {dbCredentials.db_type !== 'oracle' ? (
            <button
              type="button"
              className="text-slate-900 dark:text-[#f8f4eb]"
              onClick={addColumn}
              data-testid="add-table-add-column"
            >
              Add Column
            </button>
          ) : null}
        </div>
        {columnInputs}
        <div className="mx-auto flex w-[50%] max-w-[200px] justify-between">
          <button
            type="button"
            className="modalButton border-slate-500 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
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
