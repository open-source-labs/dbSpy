import React from 'react';
import { Handle, Position } from 'reactflow';
import { useState } from 'react';

export default function TableNodeRow({ row, tableData }) {
  // had to convert booleans to strings or they wont show up on table
  console.log('im in tablenoderow and these are the rows: ', tableData);

  const [defaultMode, setDefaultMode] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  
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

  console.log('Im in tableNodeRow, here is row data: ', row);
  return (
    <>
      <tr key={row.field_name} className='dark:text-[#f8f4eb] '>
        <td className='dark:text-[#f8f4eb]'>{editMode ? <input></input> : row.field_name}</td>
        <td className='dark:text-[#f8f4eb]'>
          {editMode ? (
            <select>
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
        <td className='dark:text-[#f8f4eb]'>
          {editMode ? (
            <select>
              <option value="NA">NA</option>
              <option value="NOT NULL">NOT NULL</option>
              <option value="PRIMARY">PRIMARY</option>
              <option value="UNIQUE">UNIQUE</option>
            </select>
          ) : (
            row.additional_constraints
          )}
        </td>
        <td className='dark:text-[#f8f4eb]'>
          {editMode ? (
            <select>
              <option value="primary-true">true</option>
              <option value="primary-false">false</option>
            </select>
          ) : (
            row.IsPrimaryKey.toString()
          )}
        </td>
        <td className='dark:text-[#f8f4eb]'>
          {editMode ? (
            <select>
              <option value="foreign-true">true</option>
              <option value="foreign-false">false</option>
            </select>
          ) : (
            row.IsForeignKey.toString()
          )}
        </td>
        <td className='dark:text-[#f8f4eb]'>
          {editMode ? (
            <button className={`save-${row.field_name}`} onClick={inDefaultMode}>
              SAVE
            </button>
          ) : deleteMode ? (
            <button className={`save-${row.field_name}`} onClick={inDefaultMode}>
              CONFIRM
            </button>
          ) : (
            <button className={`edit-${row.field_name}`} onClick={inEditMode}>
              EDIT
            </button>
          )}
        </td>
        <td className='dark:text-[#f8f4eb]'>
          {editMode ? (
            <button className={`cancel-${row.field_name}`} onClick={inDefaultMode}>
              CANCEL
            </button>
          ) : deleteMode ? (
            <button className={`cancel-${row.field_name}`} onClick={inDefaultMode}>
              CANCEL
            </button>
          ) : (
            <button className={`delete-${row.field_name}`} onClick={inDeleteMode}>
              DELETE
            </button>
          )}
        </td>
      </tr>
    </>
  );
}
