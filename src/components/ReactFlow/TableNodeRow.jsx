import React from 'react';
import { Handle, Position } from 'reactflow';
import { useState, useRef } from 'react';
import useSchemaStore from '../../store/schemaStore';

export default function TableNodeRow({ row, tableData, id }) {
  // had to convert booleans to strings or they wont show up on table
  console.log('TableNodeRow-row: ', row);
  console.log('tablename from row: ', row.TableName);
  console.log('TableNodeRow-tableData: ', tableData);
  console.log('is this ID: ', id);
  const { schemaStore, setSchemaStore } = useSchemaStore((state) => state);
  const [defaultMode, setDefaultMode] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  //create references for each row column that can be updated/deleted
  const field_name = useRef();
  const data_type = useRef();
  const additional_constraints = useRef();
  const IsPrimaryKey = useRef();
  const IsForeignKey = useRef();
  //capture changes in row properties
  const [values, newValues] = useState();

  const inDefaultMode = () => {
    console.log('you are in default mode');
    setDefaultMode(true);
    setEditMode(false);
    setDeleteMode(false);
  };

  const inEditMode = () => {
    console.log('you are in edit mode');
    setEditMode(true);
    setDefaultMode(false);
    setDeleteMode(false);
  };

  const inDeleteMode = () => {
    console.log('you are in delete mode');
    setDeleteMode(true);
    setDefaultMode(false);
    setEditMode(false);
  };

  //onSave --> updates the new row information and update schemaStore to re-render updated row information
  //access to table name (row.TableName) and row name (row.field_name) - is now (id)
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

  console.log('Im in tableNodeRow, here is row data: ', row);
  return (
    <>
      <tr key={row.field_name} id={row.field_name} className="dark:text-[#f8f4eb]">
        <td className="dark:text-[#f8f4eb]" id={`${id}-field_name`}>
          {editMode ? <input ref={field_name}></input> : row.field_name}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-data_type`}>
          {editMode ? (
            <select ref={data_type}>
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
            <select ref={additional_constraints}>
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
            <select ref={IsPrimaryKey}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            row.IsPrimaryKey.toString()
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsForeignKey`}>
          {editMode ? (
            <select ref={IsForeignKey}>
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
    </>
  );
}
