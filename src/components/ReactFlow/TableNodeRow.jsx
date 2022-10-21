import React from 'react';
import { Handle, Position } from 'reactflow';
import { useState } from 'react';

export default function TableNodeRow({ row, tableData }) {
  // had to convert booleans to strings or they wont show up on table
  console.log('im in tablenoderow and these are the rows: ', tableData);
  const [editButton, setEditButton] = useState(false);
  const [addButton, setAddButton] = useState(tableData);

  const clickEdit = () => {
    console.log('you clicked the edit button');
    setEditButton((toggle) => !toggle);
  };

  const clickAdd = () => {
    setEditButton(true);
    const newRow = (
      <tr key={row.field_name}>
        <td>{editButton ? <input></input> : row.field_name}</td>
        <td>
          {editButton ? (
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
        <td>
          {editButton ? (
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
        <td>
          {editButton ? (
            <select>
              <option value="primary-true">true</option>
              <option value="primary-false">false</option>
            </select>
          ) : (
            row.IsPrimaryKey.toString()
          )}
        </td>
        <td>
          {editButton ? (
            <select>
              <option value="foreign-true">true</option>
              <option value="foreign-false">false</option>
            </select>
          ) : (
            row.IsForeignKey.toString()
          )}
        </td>
        <td>
          <button className={`edit-${row.field_name}`} onClick={clickEdit}>
            EDIT
          </button>
        </td>
        <td>
          <button className={`delete-${row.field_name}`}>DELETE</button>
        </td>
      </tr>
    );
  };

  console.log('Im in tableNodeRow, here is row data: ', row);
  return (
    <>
      <tr key={row.field_name}>
        <td>{editButton ? <input></input> : row.field_name}</td>
        <td>
          {editButton ? (
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
        <td>
          {editButton ? (
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
        <td>
          {editButton ? (
            <select>
              <option value="primary-true">true</option>
              <option value="primary-false">false</option>
            </select>
          ) : (
            row.IsPrimaryKey.toString()
          )}
        </td>
        <td>
          {editButton ? (
            <select>
              <option value="foreign-true">true</option>
              <option value="foreign-false">false</option>
            </select>
          ) : (
            row.IsForeignKey.toString()
          )}
        </td>
        <td>
          <button className={`edit-${row.field_name}`} onClick={clickEdit}>
            EDIT
          </button>
        </td>
        <td>
          <button className={`delete-${row.field_name}`}>DELETE</button>
        </td>
      </tr>
    </>
  );
}
