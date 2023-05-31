import React, { useState } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';
import useCredentialsStore from '../../store/credentialsStore';
import { InnerReference } from '@/Types';


const AddReference: React.FC = (): JSX.Element => {
  const { currentTable, currentColumn, setEditRefMode } = useSettingsStore((state) => state);
  const { schemaStore, addForeignKeySchema, setSchemaStore } = useSchemaStore((state) => state);
  const { dbCredentials } = useCredentialsStore((state) => state);

  // Constraint Names have a character limit depending on the database
  let maxConstraintNameLength: number;
  switch(dbCredentials.db_type) {
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
  };

  // Starting values for the formValues
  const initialReference: InnerReference = {
    PrimaryKeyName: '',
    PrimaryKeyTableName: '',
    ReferencesPropertyName: currentColumn,
    ReferencesTableName: currentTable,
    isDestination: false,
    constraintName: '',
};

  const [formValues, setFormValues] = useState<InnerReference>(initialReference);
  const [tableSelected, setTableSelected] = useState<boolean>(false);
  const [columnSelected, setColumnSelected] = useState<boolean>(false);
  
  //HELPERS HELPER FUNCTION
  const nullCheck = () => {
    const mySideNav = document.getElementById('mySideNav') as HTMLDivElement | null;
    const main = document.getElementById('main') as HTMLDivElement | null;
    if (mySideNav !== null && main !== null){
      mySideNav.style.width = '0px';
      main.style.marginRight = '50px';
    };
  };

  //HELPER FUNCTIONS
  const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      
      // Preventing Errors on client side to stop quires that result in error on the server side
      if (schemaStore[formValues.PrimaryKeyTableName][formValues.PrimaryKeyName].IsConnectedToForeignKey === true) {
        window.alert(`The Primary Key of table ${formValues.PrimaryKeyTableName} is already connected by a Foreign Key from column ${formValues.ReferencesPropertyName} on table ${formValues.ReferencesTableName}.`);
        console.error(`The Primary Key of table ${formValues.PrimaryKeyTableName} is already connected by a Foreign Key from column ${formValues.ReferencesPropertyName} on table ${formValues.ReferencesTableName}.`);
        return;
      }
      /**React Flow hack.
       * Problem: Viewports larger than 1197x1197px prevent edges from rendering
       * Hacky Solution: Minify RF. Send resize-func to task queue so RF only returns to normal once edge rendering is complete
       * Process is fast enough to not be noticeable to user
       */
      nullCheck();
      const updatedForeignKey = {
        PrimaryKeyTableName: formValues.PrimaryKeyTableName,
        PrimaryKeyColumnName: formValues.PrimaryKeyName,
        ForeignKeyTableName: formValues.ReferencesTableName,
        ForeignKeyColumnName: formValues.ReferencesPropertyName,
        constraintName: formValues.constraintName.replace(/[^a-zA-Z0-9_]/g, "")
      };

      await fetch(`/api/sql/${dbCredentials.db_type}/addForeignKey`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedForeignKey)
      })

      document.querySelector('.flow')?.setAttribute('style', 'height: 10%; width: 10%;');
      addForeignKeySchema(formValues);
      setSchemaStore({
        ...schemaStore,
        [formValues.PrimaryKeyTableName]: {
          ...schemaStore[formValues.PrimaryKeyTableName],
          [formValues.PrimaryKeyName]: {
            ...schemaStore[formValues.PrimaryKeyTableName][formValues.PrimaryKeyName],
            IsConnectedToForeignKey: true
          },
        },
      });
      console.log('schemaStore', schemaStore)
      setEditRefMode(false);
      setTimeout(
        () => document.querySelector('.flow')?.setAttribute('style', 'height: 80%; width: 95%;'
        ), 0);
        return;

    } catch (err: unknown) {
      document.querySelector('.flow')?.setAttribute('style', 'height: 80%; width: 95%;');
      window.alert(err);
      console.error(err);
      };
    };

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      nullCheck();
      setEditRefMode(false);
    } catch (err: unknown) {
      window.alert(err);
      console.error(err);
    }
  };
  //END: HELPER FUNCTIONS

  const tableOptions: React.ReactNode[] = [<option key="---">---</option>];
  for (const table in schemaStore) {
    if (table !== currentTable) {
      tableOptions.push(
        <option key={table} value={table}>
          {table}
        </option>
      );
    };
  };

  const columnOptions: React.ReactNode[] = [<option key="---">---</option>];
  for (const col in schemaStore[formValues.PrimaryKeyTableName]) {
  if (schemaStore[formValues.PrimaryKeyTableName][col].IsPrimaryKey) {
      columnOptions.push(
        <option key={col} value={col}>
          {col}
        </option>
      );
    };
  };

  return (
    <div id="addReference" className="bg-[#fbf3de] dark:bg-slate-700">
      <label className="dark:text-[#f8f4eb]">
        <h3>Foreign Key References</h3>
      </label>
      <br></br>
      <span className="form-item">
        <p className="dark:text-white">
          Table: <strong>{currentTable}</strong>
        </p>
      </span>
      <br></br>
      <span className="form-item">
        <p className="dark:text-white">
          Column: <strong>{currentColumn}</strong>
        </p>
      </span>
      <br></br>
      <span className="form-item">
        <label htmlFor="db_type" className="dark:text-white">
          FK Table
        </label>
        <select
          className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
          id="ptablename"
          name="ptablename"
          // defaultValue={reference[0].PrimaryKeyTableName}
          defaultValue={formValues.PrimaryKeyTableName}
          onChange={(e) => {
            if (e.target.value === '---') return;
            setFormValues({
              ...formValues,
              PrimaryKeyTableName: e.target.value
            });
            setTableSelected(true);
          }}
        >
          {tableOptions}
        </select>
      </span>
      <br></br>
      {tableSelected ? (
        <>
          {' '}
          <span className="form-item">
            <label htmlFor="db_type" className="dark:text-white">
              FK Column
            </label>
            <select
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              id="pkeyname"
              name="pkeyname"
              defaultValue={formValues.PrimaryKeyName}
              // defaultValue={reference[0].PrimaryKeyName}
              onChange={(e) => {
                if (e.target.value === '---') return;
                setFormValues({
                  ...formValues,
                  PrimaryKeyName: e.target.value,
                  constraintName: `fk_${currentColumn.replace(/[^a-zA-Z0-9_]/g, "")}_to_${e.target.value.replace(/[^a-zA-Z0-9_]/g, "")}`
                });
                setColumnSelected(true);
              }}
            >
              {columnOptions}
            </select>
          </span>
          <br></br>
        </>
      ) : null}
      {columnSelected ? (
      <span className="form-item">
        <label htmlFor="db_type" className="dark:text-white">
          Constraint Name
        </label>
        <input
          className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
          type="text"
          maxLength={maxConstraintNameLength}
          pattern="[A-Za-z0-9_]+.{1,}"
          id="constraintname"
          name="constraintname"
          defaultValue={formValues.constraintName}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              constraintName: e.target.value.replace(/[^a-zA-Z0-9_]/g, "")
            })
          }
        />
      </span>
      ): null}
      <br></br>
      <span className="add-ref-btn">
        <button
          className="form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg"
          id="save"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg"
          id="cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </span>
      <br></br>
    </div>
  );
};

export default AddReference;
