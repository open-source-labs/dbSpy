//need to finish building this file#####################

import React from 'react';
import { SQLDataType, RowsOfData } from '../../Types';
import DataTypeOptions from './DataTypeOptions';

type RowInputProps = {
  currentTable;
  handleRowChange: (
    index: number,
    value: string | boolean
  ) => void;
  closeInputModal: () => void;
};


function DataRowInput({
 /*index, deleteRow, rowCount,row*/currentTable, handleRowChange, closeInputModal
}: RowInputProps) {

  console.log('inside RowInput', currentTable)
  //console.log(currentTable[0])
  const columns: any = [];
  const inputs = [];
  if (!currentTable.length) {
    window.alert("No column exists in the table");
    console.error("No column exists in the table");
    closeInputModal()
  } else {
    const columnNames = Object.keys(currentTable[0]);
    console.log('columnNames', columnNames);
    // const columns: any = [];
    // const inputs = [];
    columnNames.map(each => {
      columns.push(<label className=" m-2 text-center text-slate-900 dark:text-[#f8f4eb]">
        {each}
      </label>);
    });
  
    for (let i = 0; i < columns.length; i++) {
      inputs.push(
        <input
          className='m-2'
          type="text"
          required
          maxLength={63}
          onChange={(e) => {
            handleRowChange(i, e.target.value.trim());
          }}
        
        />);
    }
   }

  return (
    <div className="column-input">
      <div>
        {columns}
      </div>
      <div>
        {inputs}
      </div>
    </div>
  );
}

export default DataRowInput;
