//-----IMPORTED FILES/MODULES
import React from 'react';
import useSchemaStore from '../../store/schemaStore';

//-----TYPES
type EachRow = {
  [key:string|number]: string| number| boolean| null
}

type RowInputProps = {
  tableName: string | undefined;
  currentTable: EachRow[];
  handleRowChange: (
    index: number,
    value: string | boolean
  ) => void;
  secondaryColumnNames: string[]
};

//-----MODAL for new row inputs
export default function RowInput({
  tableName,
  currentTable,
  handleRowChange,
  secondaryColumnNames
}: RowInputProps) {

  const { schemaStore } = useSchemaStore((state) => state);
  
  const arrOfDataType = schemaStore["public." + tableName]
  const columns: JSX.Element[] = [];
  const inputs: JSX.Element[] = [];
  let columnNames: string[];

  // If current table is EMPTY, we are going to use secondaryColumnNames we got from schemaStore in DataInputModal 
  if (!currentTable.length) {
    columnNames = secondaryColumnNames;
  } else {
    columnNames = Object.keys(currentTable[0]);
  }
  columnNames.forEach((each, i) => {
    columns.push(
      <label key={i + each} className=" m-2 text-center text-slate-900 dark:text-[#f8f4eb]">
        {each}
      </label>
    );
  });
  for (let i = 0; i < columns.length; i++) {
    inputs.push(
      <input
        key={i}
        className='m-2'
        type="text"
        placeholder={arrOfDataType[columnNames[i]].data_type}
        maxLength={63}
        onChange={(e) => {
          handleRowChange(i, e.target.value.trim());
        }}
      />
    );
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


