import React from 'react';
import { Handle, Position } from 'reactflow';
import { useState, useRef, useEffect } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';
import useFlowStore from '../../store/flowStore';
import createEdges from './createEdges';
import createNodes from './createNodes';
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaRegSave,
  FaRegCheckSquare,
  FaRegWindowClose,
} from 'react-icons/fa';

export default function TableNodeRow({ row, id }) {
  // TODO: can we take reference out of the store? only accessed in this component I believe
  const { schemaStore, setSchemaStore } = useSchemaStore((state) => state);
  const { edges, setEdges, nodes, setNodes } = useFlowStore((state) => state);
  const { editRefMode, setEditRefMode } = useSettingsStore((state) => state);

  // Rows can be in one of three modes: default, edit, or delete
  const [mode, setMode] = useState('default');

  const [rowData, setRowData] = useState({ ...row });
  /* rowData shape:
    {
      Name: string,
      Value: any,
      TableName: string,
      References: [
        {
          PrimaryKeyName: string,
          ReferencesPropertyName: string,
          PrimaryKeyTableName: string,
          ReferencesTableName: string,
          IsDestination: boolean,
          constrainName: string
        }
      ],
      IsPrimaryKey: boolean,
      IsForeignKey: boolean,
      field_name: string,
      data_type: string,
      additional_constraints: string
    }
  */
  // TODO: change to formData state
  // const selectedRow = useRef();
  // const field_name = useRef();
  // const data_type = useRef();
  // const additional_constraints = useRef();
  // const IsPrimaryKey = useRef();
  // const IsForeignKey = useRef();

  const onSave = () => {
    const defaultRef = [
      {
        PrimaryKeyName: '',
        ReferencesPropertyName: '',
        PrimaryKeyTableName: '',
        ReferencesTableName: '',
        IsDestination: '',
        constrainName: '',
      },
    ];
    //declare prior values
    const currentSchema = { ...schemaStore };
    currentSchema[rowData.TableName][rowData.field_name] = rowData;
    currentSchema[rowData.TableName][rowData.field_name].References = rowData.IsForeignKey
      ? reference
      : defaultRef;
    // If row name has changed, delete entry with old row name
    if (row.field_name !== rowData.field_name) {
      delete currentSchema[row.TableName][row.field_name];
    }
    //set new values to the schemaStore
    setSchemaStore(currentSchema);
    //set reference back to defaultRef
    setReference(defaultRef);
    //set nodes/edges
    const initialEdges = createEdges(currentSchema);
    setEdges(initialEdges);
    const initialNodes = createNodes(currentSchema, initialEdges);
    setNodes(initialNodes);
    setMode('default');
  };

  const onDelete = () => {
    //declare prior values
    const tableRef = rowData.TableName;
    const rowRef = rowData.field_name;
    const currentSchema = { ...schemaStore };
    delete currentSchema[tableRef][rowRef];
    setSchemaStore(currentSchema);
  };

  // console.log('Im in tableNodeRow, here is row data: ', row);
  return (
    <>
      {/* TODO: SEE ABOUT DELETING KEY ATTRIBUTE AND ID ATTRIBUTES */}
      <tr key={row.field_name} id={row.field_name} className="dark:text-[#f8f4eb] ">
        <td className="dark:text-[#f8f4eb]" id={`${id}-field_name`}>
          {mode === 'edit' ? (
            <input
              className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black"
              value={rowData.field_name}
              onChange={(e) =>
                setRowData((prevData) => ({
                  ...prevData,
                  Name: e.target.value,
                  field_name: e.target.value.replaceAll(/\s/g, '_'),
                }))
              }
            ></input>
          ) : (
            rowData.field_name
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-data_type`}>
          {mode === 'edit' ? (
            <select
              className="bg-[#f8f4eb] dark:text-black"
              value={rowData.data_type}
              onChange={(e) =>
                setRowData((prevData) => ({ ...prevData, data_type: e.target.value }))
              }
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
            rowData.data_type
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-additional_constraints`}>
          {mode === 'edit' ? (
            <select
              className="bg-[#f8f4eb] dark:text-black"
              value={rowData.additional_constraints}
              onChange={(e) =>
                setRowData((prevData) => ({
                  ...prevData,
                  additional_constraints: e.target.value,
                }))
              }
            >
              <option value="NA">NA</option>
              <option value="NOT NULL">NOT NULL</option>
              <option value="PRIMARY">PRIMARY</option>
              <option value="UNIQUE">UNIQUE</option>
            </select>
          ) : (
            rowData.additional_constraints
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsPrimaryKey`}>
          {mode === 'edit' ? (
            <select
              className="bg-[#f8f4eb] dark:text-black"
              value={rowData.IsPrimaryKey}
              onChange={(e) =>
                setRowData((prevData) => ({ ...prevData, IsPrimaryKey: e.target.value }))
              }
            >
              <option value={true}>true</option>
              <option value={false}>false</option>
            </select>
          ) : (
            rowData.IsPrimaryKey.toString()
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsForeignKey`}>
          {mode === 'edit' ? (
            <select
              onChange={(e) => {
                setRowData((prevData) => ({ ...prevData, IsForeignKey: e.target.value }));

                // console.log('ONCHANGE TO TRUE', e.target.value);
                const defaultRef = [
                  {
                    PrimaryKeyName: '',
                    ReferencesPropertyName: '',
                    PrimaryKeyTableName: '',
                    ReferencesTableName: '',
                    IsDestination: '',
                    constrainName: '',
                  },
                ];
                if (e.target.value === true) {
                  //expose Add Reference modal
                  document.querySelector('#mySideNav').style.width = '400px';
                  document.querySelector('#main').style.marginRight = '400px';
                  setEditRefMode(true);
                  // TODO: clean up the reference procedure
                  if (rowData.References.length === 0) setReference(defaultRef);
                  else setReference([rowData.References[0]]);
                }
              }}
              className="bg-[#f8f4eb] dark:text-black"
              value={rowData.IsForeignKey}
            >
              <option value={true}>true</option>
              <option value={false}>false</option>
            </select>
          ) : (
            rowData.IsForeignKey.toString()
          )}
        </td>
        <td className="dark:text-[#f8f4eb]">
          {mode === 'edit' ? (
            <button
              id={`${id}-saveBtn`}
              onClick={onSave}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegSave size={17} />
            </button>
          ) : mode === 'delete' ? (
            <button
              id={`${id}-confirmBtn`}
              onClick={() => {
                onDelete();
                setMode('default');
              }}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegCheckSquare size={17} />
            </button>
          ) : (
            <button
              id={`${id}-editBtn`}
              onClick={() => setMode('edit')}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegEdit size={17} />
            </button>
          )}
        </td>
        <td className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
          {mode === 'edit' ? (
            <button
              id={`${id}-cancelBtn`}
              onClick={() => {
                setRowData({ ...row });
                setMode('default');
              }}
            >
              <FaRegWindowClose size={17} />
            </button>
          ) : mode === 'delete' ? (
            <button id={`${id}-cancelBtn`} onClick={() => setMode('default')}>
              <FaRegWindowClose size={17} />
            </button>
          ) : (
            <button id={`${id}-deleteBtn`} onClick={() => setMode('delete')}>
              <FaRegTrashAlt size={17} />
            </button>
          )}
        </td>
      </tr>
    </>
  );
}
