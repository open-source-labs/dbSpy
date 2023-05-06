import React from 'react';

type RowInputProps = {
  currentTable;
  handleRowChange: (
    index: number,
    value: string | boolean
  ) => void;
  secondaryColumnNames: string[]
};

function DataRowInput({
currentTable, handleRowChange, secondaryColumnNames
}: RowInputProps) {
  const columns: any = [];
  const inputs = [];
  let columnNames: string[];
  if (!currentTable.length) {
    columnNames = secondaryColumnNames;
  } else {
    columnNames = Object.keys(currentTable[0]);
  }
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
