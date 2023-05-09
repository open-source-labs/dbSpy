// React & React Router & React Query Modules;
import React, { useState } from 'react';

// Components Imported;
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';
import { Reference } from '@/Types';

// interface ForeignKeyUpdateType  {
//     PrimaryKeyTableName: string,
//     PrimaryKeyColumnName: string,
//     ForeignKeyTableName: string,
//     ForeignKeyColumnName:string
// }



const AddReference: React.FC = () => {
  const { currentTable, currentColumn, setEditRefMode } = useSettingsStore(
    (state) => state
  );
  const { schemaStore, addForeignKeySchema } = useSchemaStore((state) => state);

  const initialReference: Reference = {
    // For whatever reason, PrimaryKeyName and PrimaryKeyTableName refer to other table
    PrimaryKeyName: '',
    PrimaryKeyTableName: '',
    // ReferencesPropertyName and ReferencesTableName refer to the table we are adding the fk to
    ReferencesPropertyName: currentColumn,
    ReferencesTableName: currentTable,
    IsDestination: false,
    constraintName: `${currentTable}_fk${
      schemaStore[currentTable][currentColumn].References.length + 1
    }`,
  };
  //STATE DECLARATION (dbSpy3.0)
  //END: STATE DECLARATION

  //form state hooks
  const [formValues, setFormValues] = useState<Reference>(initialReference);

  //HELPERS HELPER FUNCTION
  const nullCheck = () => {
    const mySideNav = document.getElementById('mySideNav') as HTMLDivElement | null;
    const main = document.getElementById('main') as HTMLDivElement | null;
    if (mySideNav !== null && main !== null){
    mySideNav.style.width = '0px';
    main.style.marginRight = '50px';
    }
  }

  //HELPER FUNCTIONS
  const onSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      /**React Flow hack.
       * Problem: Viewports larger than 1197x1197px prevent edges from rendering
       * Hacky Solution: Minify RF. Send resize-func to task queue so RF only returns to normal once edge rendering is complete
       * Process is fast enough to not be noticeable to user
       */
      nullCheck();
      console.log(formValues)
      //TODO: Send input from FK form to backend
      const updatedForeignKey: Reference = {
        PrimaryKeyTableName: formValues.PrimaryKeyTableName,
        PrimaryKeyColumnName: formValues.PrimaryKeyName,
        ForeignKeyTableName: formValues.ReferencesTableName,
        ForeignKeyColumnName:formValues.ReferencesPropertyName
      }
      fetch('/api/sql/postgres/addForeignKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedForeignKey)
      })
      document
        .querySelector('.flow')?.setAttribute('style', 'height: 10%; width: 10%;');
      addForeignKeySchema(formValues);
      setEditRefMode(false);
      setTimeout(
        () =>
          document
            .querySelector('.flow')
            ?.setAttribute('style', 'height: 80%; width: 95%;'),
        0
      );
    } catch (err: unknown) {
      window.alert(err);
      console.error(err);
    }
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
}
  //END: HELPER FUNCTIONS

  const tableOptions: React.ReactNode[] = [<option key="---">---</option>];
  for (const table in schemaStore) {
    if (table !== formValues.ReferencesTableName) {
      tableOptions.push(
        <option key={table} value={table}>
          {table}
        </option>
      );
    }
  }

  const columnOptions: React.ReactNode[] = [<option key="---">---</option>];
  for (const col in schemaStore[formValues.PrimaryKeyTableName]) {
    columnOptions.push(
      <option key={col} value={col}>
        {col}
      </option>
    );
  }

  return (
    <div id="addReference" className="bg-[#fbf3de] dark:bg-slate-700">
      <label className="dark:text-[#f8f4eb]">
        <h3>Foreign Key References</h3>
      </label>
      <br></br>
      <span className="form-item">
        <p className="dark:text-white">
          Table: <strong>{formValues.ReferencesTableName}</strong>
        </p>
      </span>
      <br></br>
      <span className="form-item">
        <p className="dark:text-white">
          Column: <strong>{formValues.ReferencesPropertyName}</strong>
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
            setFormValues({ ...formValues, PrimaryKeyTableName: e.target.value });
          }}
        >
          {tableOptions}
        </select>
      </span>

      <br></br>
      {formValues.PrimaryKeyTableName.length > 0 && (
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
                setFormValues({ ...formValues, PrimaryKeyName: e.target.value });
              }}
            >
              {columnOptions}
            </select>
          </span>
          <br></br>
        </>
      )}

      <span className="form-item">
        <label htmlFor="db_type" className="dark:text-white">
          Constraint Name
        </label>
        <input
          className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
          type="text"
          id="constraintname"
          name="constraintname"
          value={formValues.constraintName}
          onChange={(e) =>
            setFormValues({ ...formValues, constraintName: e.target.value })
          }
        />
      </span>
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
