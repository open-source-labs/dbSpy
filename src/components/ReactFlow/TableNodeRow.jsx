import React from 'react';
import { Handle, Position } from 'reactflow';
import { useState, useRef, useEffect } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';
import createInitialEdges from './Edges';
import createInitialNodes from './Nodes';

export default function TableNodeRow({ row, tableData, id }) {
  // had to convert booleans to strings or they wont show up on table
  // console.log('TableNodeRow-row: ', row);
  // console.log('tablename from row: ', row.TableName);
  // console.log('TableNodeRow-tableData: ', tableData);
  // console.log('is this ID: ', id);
  const { schemaStore, setSchemaStore, reference, setReference } = useSchemaStore((state) => state);
  const {setEdges, setNodes} = useFlowStore(state=>state);
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
  
  //HELPER FUNCTIONS
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
  }

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
    currentSchema[tableRef][rowRef].Name = field_name.current.value;
    currentSchema[tableRef][rowRef].Value = null;
    currentSchema[tableRef][rowRef].TableName = tableRef;
    currentSchema[tableRef][rowRef].References = reference;
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
    const initialEdges = createInitialEdges(currentSchema);
    setEdges(initialEdges);
    const initialNodes = createInitialNodes(currentSchema, initialEdges);
    setNodes(initialNodes);
    setReference([]);
    console.log('NEW SCHEMA FROM ONSAVE', schemaStore);
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
              onChange={(e)=>{
                // console.log('ONCHANGE TO TRUE', e.target.value);
                if(e.target.value === 'true') {
                  //expose Add Reference modal
                  // openAddReferenceModal();
                  document.querySelector('#addReferenceModal').style.display = "block";
                  document.querySelector('#addReferenceModal').style.zIndex = "100";
                }  
                else setReference([]);
              }}
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
    </>
  );
}
