import React from 'react';
import useSchemaStore from '../../store/schemaStore';

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

  const{schemaStore} = useSchemaStore((state) => state);

  //console.log(schemaStore)
  
  let additionalConstraints;
  //find table name and column name that has additionalConstraints 'NOT NULL HAS_IDENTITY'
    //input for that table and colmn => placeholder should say "auto generate by DB"
  for (let eachTable in schemaStore) {
    for (let eachColumn in schemaStore[eachTable]) {
      if (eachColumn.additional_constraints === 'NOT NULL HAS_IDENTITY') {
        additionalConstraints = eachColumn
      }
     }
   }


  const columns = [];
  const inputs = [];
  let columnNames: string[];
  if (!currentTable.length) {
    columnNames = secondaryColumnNames;
  } else {
    columnNames = Object.keys(currentTable[0]);
  }
    columnNames.map((each, i) => {
      columns.push(<label key={i+each} className=" m-2 text-center text-slate-900 dark:text-[#f8f4eb]">
        {each}
      </label>);
    });
  
  for (let i = 0; i < columns.length; i++) {
      //if additionalConstraints ===column name
        //placeholder should say "auto generate by DB"
      inputs.push(
        <input
          key={i+columns[i]}
          className='m-2'
          type="text"
          // required
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
