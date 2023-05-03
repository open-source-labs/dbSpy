//need to finish building this file#####################

import React, { useState } from 'react';
import { SQLDataType, ColumnData, RowsOfData } from '../../Types';
import ColumnInput from './ColumnInput';
import useSchemaStore from '../../store/schemaStore';
import useDataStore from '../../store/dataStore';
import RowInput from './RowInput';

//i dont think we need table mode?!, since we are not going to create new tables for data
type InputModalProps = {
  // mode: 'table' | 'row';
  closeInputModal: () => void;
  tableNameProp?: string;
};

//############ where this closeInputModal came from????????????????
// what closeInputModal does is.... setInputModalState(false)

type DataRowArray = Array<string | number | boolean | null>

export default function DataInputModal({
  // mode,
  closeInputModal,
  tableNameProp,
}: InputModalProps) {

  const initialTable: string = 'untitled_table';

  //do we need initial row for data table??? maybe not...... since we are not creating new table in data section
  // const initialRows: DataRowArray = [];

  const additionalRows: DataRowArray = [];

  const [tableName, setTableName] = useState/*<string>*/(() => {
    // if (!tableNameProp) return initialTable;
    // else
      return tableNameProp;
  });
  const [rowData, setRowData] = useState/*<DataRowArray>*/(() => {
    // if (mode === 'table') return initialRows;
    // else
      return additionalRows;
  });


  const { dataStore, addTableData} = useDataStore(
    (state) => state
  );

  console.log('here!! dataStore!!', dataStore) //we can use this to access data info

  const handleSubmit = (): boolean => {
    // table must be added to schema first to enable column validity checks
    try {
      addRow(tableName, rowData);
      return true;
    } catch (error) {
      window.alert(error);
      console.error(error);
      return false;
    }
  };

  const newRow: DataRowArray = [];  //out inputs goes here??

  //#######################
  //TO SAVE ALL THESE NEW DATA/UPDATES to DB => need another function for SAVE info we alter/add
  //need to convert this "newRow" into format of obj => ex) {id: new data, something: new data}
  //keys for this obj format === first row of our table
  //then, send to backend via AXIOS request
  //#######################

  const addRow = () => {
    setRowData((prevRows) => {
      prevRows.push(newRow);
      return [...prevRows];
    });
  };

  const deleteRow = (index: number) => {
    setRowData((prevRows) => {
      prevRows.splice(index, 1);
      return [...prevRows];
    });
  };

  const rowEdit = () => {
    //replacing hadleColumnChange???
  }
  

  const rowInputs = rowData.map((row, index) => (
    <RowInput
      key={`row-${index}`}
      index={index}
      deleteRow={deleteRow}
      row={row}
      // handleColumnChange={handleColumnChange}
      // name={row.name}
      // type={row.type}
      // isNullable={row.isNullable}
      // isPrimary={row.isPrimary}
      // defaultValue={row.defaultValue}
      rowCount={rowData.length}
      // mode={mode}
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
          {<h1>{`Table Name: ${tableName}`}</h1>}
        </div>        

        <div className="column-header">
          <h1 className="  text-slate-900 dark:text-[#f8f4eb]">
            {'New Rows'}
          </h1>
          <button
            type="button"
            className="  text-slate-900 dark:text-[#f8f4eb]"
            onClick={addRow}
            data-testid="add-table-add-column"
          >
            Add Row
          </button>
        </div>
        {rowInputs}
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
            // need to work on this ###############
            //we need to create function for sending collected data to DB
            // onClick={updateDB}
          >
            { 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}