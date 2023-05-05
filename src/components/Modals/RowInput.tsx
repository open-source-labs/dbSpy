//need to finish building this file#####################

import React from 'react';
import { SQLDataType, RowsOfData } from '../../Types';
import DataTypeOptions from './DataTypeOptions';

// type ColumnInputProps = {
//   index: number;
//   deleteColumn: (index: number) => void;
//   handleColumnChange: (
//     index: number,
//     property: keyof RowsOfData,
//     value: string | boolean
//   ) => void;
//   name: string;
//   type: SQLDataType;
//   isNullable: boolean;
//   isPrimary: boolean;
//   defaultValue: string | null;
//   columnCount: number;
//   mode: 'table' | 'column';
// };


function DataRowInput({
 index, deleteRow, /*row*/currentTable, handleRowChange, rowCount
}: ColumnInputProps) {

  console.log('inside RowInput', currentTable)
  //console.log(currentTable[0])
  const columnNames = Object.keys(currentTable[0])
  //console.log('columnNames', columnNames)
  const columns:any = []
  const inputs = []
  columnNames.map(each => {
    columns.push(<label className=" m-2 text-center text-slate-900 dark:text-[#f8f4eb]">
      {each}
    </label>)
   })
  for (let i = 0; i < columns.length; i++) {
    inputs.push(
      <input
        className='m-2'
          type="text"
          required
          maxLength={63}
          onChange={(e) => {
            handleRowChange( i, e.target.value.trim());
          }}
        />)
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
