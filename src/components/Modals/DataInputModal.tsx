//-----IMPORTED FILES/MODULES
import axios from 'axios';
import React, { useState } from 'react';
import useDataStore from '../../store/dataStore';
import useCredentialsStore from '../../store/credentialsStore';
import useSchemaStore from '../../store/schemaStore';
import RowInput from './RowInput';
import { RowsOfData } from '@/Types';

//-----TYPES
type InputDataModalProps = {
  mode: string;
  closeDataInputModal: () => void;
  tableNameProp?: string;
};

type DataObj = {
  [key: string]: string | number | boolean | null;
};

type DataRowArray = Array<string | number | boolean | null>;

//----- SENDING COLLECTED INPUTS FROM ROWINPUT.TSX TO BACKEND
export default function DataInputModal({
  mode,
  closeDataInputModal,
  tableNameProp,
}: InputDataModalProps) {
  const [tableName] = useState(tableNameProp);
  const [rowData, setRowData] = useState<DataRowArray>([]);
  const [rowDataArr, setRowDataArr] = useState<RowsOfData[]>([]);
  const { schemaStore, setSchemaStore } = useSchemaStore((state) => state);
  const { dbCredentials } = useCredentialsStore((state) => state);
  const { dataStore, setDataStore, addTableData } = useDataStore((state) => state);

  //entire rows we currently have
  const deepCopyDataStore = JSON.parse(JSON.stringify(dataStore));
  const currentTable = deepCopyDataStore[tableName as string]
    ? deepCopyDataStore[tableName as string]
    : [];

  // we get the column names from schemaStore IN CASE current table is EMPTY (because if table is EMPTY, it will
  // not pass in the column names)
  const secondaryColumnNames: string[] = Object.keys(schemaStore[tableName as string]);

  const updatingDB = async (newRow: DataObj): Promise<void> => {
    addTableData(tableName!, newRow);
    //new column data that will be sent in the post request body
    const dataToSend = {
      tableName: tableName,
      newRow: newRow,
    };
    //adds new column to the selected table
    await fetch(`/api/sql/${dbCredentials.db_type}/addRow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const additionalRow: Record<string, string | number | boolean | null> = {};
      // in case current table is EMPTY
      if (!currentTable.length) {
        secondaryColumnNames.forEach((columnName, i) => {
          additionalRow[columnName] = rowData[i];
        });
        //currentTable = [];
      } else {
        // in case current table is NOT EMPTY
        Object.keys(currentTable[0]).forEach((columnName, i) => {
          additionalRow[columnName] = rowData[i];
        });
      }
      currentTable.push(additionalRow);

      // send backend the new row ONLY to add this row to table we had

      await Promise.resolve(updatingDB(currentTable[currentTable.length - 1]));
    } catch (error) {
      window.alert(error);
      console.error(error);
    }
  };

  const handleRowChange = (index: number, value: string | number | boolean | null) => {
    //updating rowData (row of inputs for each column)
    setRowData((prevRows) => {
      prevRows[index] = value;
      return [...prevRows];
    });
  };

  return (
    <div id="inputModal" className="input-modal">
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          closeDataInputModal();
        }}
        className="modal-content rounded-md bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]"
      >
        <div className="table-name">
          {<h1 className="flex justify-center">{`Table: ${tableName}`}</h1>}
        </div>
        <div className="column-header">
          <h1 className="flex flex-auto justify-center text-slate-900 dark:text-[#f8f4eb]">
            {'New Row'}
          </h1>
        </div>
        <RowInput
          tableName={tableName}
          currentTable={currentTable}
          handleRowChange={handleRowChange}
          secondaryColumnNames={secondaryColumnNames}
        />
        <div className="mx-auto flex w-[50%] max-w-[200px] justify-between">
          <button
            type="button"
            className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
            onClick={closeDataInputModal}
            data-testid="modal-cancel"
          >
            Cancel
          </button>
          <button
            className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
            data-testid="modal-submit"
          >
            Add Row
          </button>
        </div>
      </form>
    </div>
  );
}
