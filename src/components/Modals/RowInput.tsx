//-----IMPORTED FILES/MODULES
import React from 'react';
import useSchemaStore from '../../store/schemaStore';
import useCredentialsStore from '../../store/credentialsStore';

//-----TYPES
type EachRow = {
  [key: string | number]: string | number | boolean | null;
};

type RowInputProps = {
  tableName: string | undefined;
  currentTable: EachRow[];
  handleRowChange: (index: number, value: string | boolean) => void;
  secondaryColumnNames: string[];
};

//-----MODAL for new row inputs
export default function RowInput({
  tableName,
  currentTable,
  handleRowChange,
  secondaryColumnNames,
}: RowInputProps) {
  const { dbCredentials } = useCredentialsStore((state) => state);
  const { schemaStore } = useSchemaStore((state) => state);

  const arrOfDataType = schemaStore[tableName as string];
  const columns: JSX.Element[] = [];
  const inputs: JSX.Element[] = [];
  let columnNames: string[];
  console.log('dbCredentials', dbCredentials);
  let maxConstraintNameLength: number;
  switch (dbCredentials.db_type) {
    case 'mysql':
      maxConstraintNameLength = 64;
    case 'mssql':
      maxConstraintNameLength = 128;
    case 'oracle':
      maxConstraintNameLength = 30;
    case 'sqlite':
      maxConstraintNameLength = 255;
    default:
      maxConstraintNameLength = 63; //Postgres
      if (!dbCredentials.db_type) {
        dbCredentials.db_type = 'postgres';
      }
  }

  console.log(
    '====== currentTable (in RowInput) ** BEFORE ternary ** ======',
    currentTable
  );
  //adding first row of data current table = [], with length=0, and _prototype
  //when it runs through the function it ends up being [{with properties}]
  currentTable = currentTable ? currentTable : [];
  console.log('ternery etst');
  console.log(
    '====== currentTable (in RowInput) ** AFTER ternary ** ======',
    currentTable
  );
  // If current table is EMPTY, we are going to use secondaryColumnNames we got from schemaStore in DataInputModal
  if (!currentTable.length) {
    columnNames = secondaryColumnNames;
  } else {
    columnNames = Object.keys(currentTable[0]);
  }
  columnNames.forEach((each, i) => {
    columns.push(
      <label
        key={i + each}
        className=" m-2 text-center text-slate-900 dark:text-[#f8f4eb]"
      >
        {each}
      </label>
    );
  });
  for (let i = 0; i < columns.length; i++) {
    inputs.push(
      <input
        key={i}
        className="m-2"
        type="text"
        placeholder={arrOfDataType[columnNames[i]].data_type}
        maxLength={maxConstraintNameLength}
        onChange={(e) => {
          handleRowChange(i, e.target.value.trim());
        }}
      />
    );
  }

  return (
    <div className="column-input">
      <div>{columns}</div>
      <div>{inputs}</div>
    </div>
  );
}
