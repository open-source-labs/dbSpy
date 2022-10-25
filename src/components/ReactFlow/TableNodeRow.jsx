import React from 'react';
import { Handle, Position } from 'reactflow';
import { useState, useRef, useEffect } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';

export default function TableNodeRow({ row, tableData, id }) {
  // had to convert booleans to strings or they wont show up on table
  // console.log('TableNodeRow-row: ', row);
  // console.log('tablename from row: ', row.TableName);
  // console.log('TableNodeRow-tableData: ', tableData);
  // console.log('is this ID: ', id);
  const { schemaStore, setSchemaStore } = useSchemaStore((state) => state);
  const [defaultMode, setDefaultMode] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  //create useRef's for each row column that can be updated/deleted
  const selectedRow = useRef();
  const field_name = useRef();
  const data_type = useRef();
  const additional_constraints = useRef();
  const IsPrimaryKey = useRef();
  const IsForeignKey = useRef();

  //create local state for reference array on add/edit row
  const [reference, setReference] = useState();
  const addReferenceModal = useRef();
  const PrimaryKeyNameInput = useRef();
  const ReferencesPropertyNameInput = useRef();
  const PrimaryKeyTableNameInput = useRef();
  const ReferencesTableNameInput = useRef();
  const IsDestinationInput = useRef();
  const constrainNameInput = useRef();

  // useEffect(() => {
  //   if(editMode)
  //     setReference ([{
  //       PrimaryKeyName: PrimaryKeyNameInput.current.value,
  //       ReferencesPropertyName: ReferencesPropertyNameInput.current.value,
  //       PrimaryKeyTableName: PrimaryKeyTableNameInput.current.value,
  //       ReferencesTableName: ReferencesTableNameInput.current.value,
  //       IsDestination: IsDestinationInput.current.value, 
  //       constrainName: constrainNameInput.current.value,
  //     }]);
  // });

  // useEffect(() => {
  //   if(IsForeignKey.current.value === 'true' && editMode)
  //   openAddReferenceModal();
  // });
  
  //HELPER FUNCTIONS
/* When the user clicks, open the modal */
  const openAddReferenceModal = () => {
    addReferenceModal.current.style.display = "block";
    addReferenceModal.current.style.zIndex = "100";
  }
  /* When the user clicks 'yes' or 'no', close it */
  const closeAddReferenceModal = (response) => {
    addReferenceModal.current.style.display = "none";
    if (response) addReference();
    PrimaryKeyNameInput.current.value = '';
    ReferencesPropertyNameInput.current.value = '';
    PrimaryKeyTableNameInput.current.value = '';
    ReferencesTableNameInput.current.value = '';
    IsDestinationInput.current.value = '';
    constrainNameInput.current.value = '';
  }

  const addReference = () => {
    setReference ([{
      PrimaryKeyName: PrimaryKeyNameInput.current.value,
      ReferencesPropertyName: ReferencesPropertyNameInput.current.value,
      PrimaryKeyTableName: PrimaryKeyTableNameInput.current.value,
      ReferencesTableName: ReferencesTableNameInput.current.value,
      IsDestination: IsDestinationInput.current.value, 
      constrainName: constrainNameInput.current.value,
    }]);
  }


  const inDefaultMode = () => {
    // console.log('you are in default mode');
    setDefaultMode(true);
    setEditMode(false);
    setDeleteMode(false);
  };

  const inEditMode = () => {
    // console.log('you are in edit mode');
    setEditMode(true);
    setDefaultMode(false);
    setDeleteMode(false);
  };

  const inDeleteMode = () => {
    // console.log('you are in delete mode');
    setDeleteMode(true);
    setDefaultMode(false);
    setEditMode(false);
  };

  const onSave = () => {
    //declare prior values
    const tableRef = row.TableName;
    const rowRef = row.field_name;
    const currentSchema = { ...schemaStore };
    currentSchema[tableRef][rowRef].field_name = field_name.current.value;
    currentSchema[tableRef][rowRef].data_type = data_type.current.value;
    currentSchema[tableRef][rowRef].additional_constraints =
      additional_constraints.current.value;
    currentSchema[tableRef][rowRef].IsPrimaryKey = IsPrimaryKey.current.value === 'true';
    currentSchema[tableRef][rowRef].IsForeignKey = IsForeignKey.current.value === 'true';
    //check if row name has changed
    if (rowRef !== field_name.current.value) {
      currentSchema[tableRef][field_name.current.value] = currentSchema[tableRef][rowRef];
      delete currentSchema[tableRef][rowRef];
    }
    //set new values to the schemaStore
    setSchemaStore(currentSchema);
    console.log('NEW SCHEMA', schemaStore);
  };

  const onDelete = () => {
    //declare prior values
    const tableRef = row.TableName;
    const rowRef = row.field_name;
    const currentSchema = { ...schemaStore };
    delete currentSchema[tableRef][rowRef];
    setSchemaStore(currentSchema);
    console.log('NEW SCHEMA', schemaStore);
  };
  //END: HELPER FUNCTIONS



  // console.log('Im in tableNodeRow, here is row data: ', row);
  return (
    <>
      <tr ref={selectedRow} key={row.field_name} id={row.field_name} className="dark:text-[#f8f4eb] ">
        <td className="dark:text-[#f8f4eb]" id={`${id}-field_name`}>
          {editMode ? (
            <input
              ref={field_name}
              className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black"
              defaultValue={row.field_name}
            ></input>
          ) : (
            row.field_name
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-data_type`}>
          {editMode ? (
            <select
              ref={data_type}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.data_type}
            >
              <option value="binary">binary</option>
              <option value="blob">blob</option>
              <option value="boolean">boolean</option>
              <option value="date">date</option>
              <option value="datetime">datetime</option>
              <option value="decimal">decimal</option>
              <option value="float">float</option>
              <option value="integer">integer</option>
              <option value="serial">serial</option>
              <option value="text">text</option>
              <option value="time">time</option>
              <option value="timestamp">timestamp</option>
              <option value="varchar">varchar</option>
            </select>
          ) : (
            row.data_type
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-additional_constraints`}>
          {editMode ? (
            <select
              ref={additional_constraints}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.additional_constraints}
            >
              <option value="NA">NA</option>
              <option value="NOT NULL">NOT NULL</option>
              <option value="PRIMARY">PRIMARY</option>
              <option value="UNIQUE">UNIQUE</option>
            </select>
          ) : (
            row.additional_constraints
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsPrimaryKey`}>
          {editMode ? (
            <select
              ref={IsPrimaryKey}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.IsPrimaryKey ? 'true' : 'false'}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            row.IsPrimaryKey.toString()
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsForeignKey`}>
          {editMode ? (
            <select
              ref={IsForeignKey}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.IsForeignKey ? 'true' : 'false'}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            row.IsForeignKey.toString()
          )}
        </td>
        <td className="dark:text-[#f8f4eb]">
          {editMode ? (
            <button
              id={`${id}-saveBtn`}
              onClick={() => {
                onSave();
                inDefaultMode();
              }}
            >
              SAVE
            </button>
          ) : deleteMode ? (
            <button
              id={`${id}-confirmBtn`}
              onClick={() => {
                onDelete();
                inDefaultMode();
                // selectedRow.current.remove();
              }}
            >
              CONFIRM
            </button>
          ) : (
            <button id={`${id}-editBtn`} onClick={inEditMode}>
              EDIT
            </button>
          )}
        </td>
        <td className="dark:text-[#f8f4eb]">
          {editMode ? (
            <button id={`${id}-cancelBtn`} onClick={inDefaultMode}>
              CANCEL
            </button>
          ) : deleteMode ? (
            <button id={`${id}-cancelBtn`} onClick={inDefaultMode}>
              CANCEL
            </button>
          ) : (
            <button id={`${id}-deleteBtn`} onClick={inDeleteMode}>
              DELETE
            </button>
          )}
        </td>
      </tr>
    
      {/* MODAL FOR ADD NEW REFERENCES */}
      <div ref={addReferenceModal} id="addReferenceModal" className="addReferenceModal">
        {/* <!-- Add Table Modal content --> */}
        <div className="modal-content content-center bg-[#f8f4eb] dark:bg-slate-800 rounded-md border-0 w-[30%] min-w-[300px] max-w-[550px] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:shadow-[0px_5px_10px_#1e293b]">
          <p className="text-center mb-4 text-slate-900 dark:text-[#f8f4eb]">Foreign Key References</p>
          <div className='flex justify-between w-[50%] max-w-[200px] mx-auto'>
            <label>PrimaryKeyName: </label><input ref={PrimaryKeyNameInput} />
            <label>ReferencesPropertyName: </label><input ref={ReferencesPropertyNameInput} />
            <label>PrimaryKeyTableName: </label><input ref={PrimaryKeyTableNameInput} />
            <label>ReferencesTableName: </label><input ref={ReferencesTableNameInput} />
            <label>IsDestination: </label><input ref={IsDestinationInput} />
            <label>constraintNameInput</label><input ref={constrainNameInput} />
            <button onClick={()=>closeAddReferenceModal(true)} className="text-slate-900 dark:text-[#f8f4eb] modalButton">SAVE</button>
            <button onClick={()=>closeAddReferenceModal(false)} className="text-slate-900 dark:text-[#f8f4eb] modalButton">CANCEL</button>
          </div> 
        </div>
      </div>
    </>
  );
}
