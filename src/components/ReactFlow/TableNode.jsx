import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import TableNodeRow from './TableNodeRow';
import InputModal from '../Modals/InputModal';
import useSchemaStore from '../../store/schemaStore';
import { FaRegPlusSquare } from 'react-icons/fa';

export default function TableNode({ data }) {
  // state of schema object
  const { schemaStore, addColumnSchema } = useSchemaStore((state) => state);
  // rowData is an array of objects with each row in the table as an element
  const rowData = Object.values(data.table[1]);
  const [tableRows, setTableRows] = useState(rowData);
  // function to generate handles on the table by iterating through all
  // schema edges to match source and target handles of edges to handle id
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === data.table[0]) {
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-source-${[i]}`}
          type="source"
          position={Position.Right}
          id={data.edges[i].sourceHandle}
          style={{ bottom: 9, top: 'auto' }}
        />
      );
    }
    if (data.edges[i].target === data.table[0]) {
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-target-${[i]}`}
          type="target"
          position={Position.Left}
          id={data.edges[i].targetHandle}
          style={{ bottom: 'auto', top: 113 }}
        />
      );
    }
  }
  // helper function when adding row to table
  // const addRow = () => {
  //   const currentSchema = { ...schemaStore };
  //   currentSchema[data.table[0]].newRow = {
  //     Name: '',
  //     Value: '',
  //     TableName: data.table[0],
  //     References: [
  //       {
  //         PrimaryKeyName: '',
  //         ReferencesPrimaryName: '',
  //         PrimaryKeyTableName: '',
  //         ReferencesTableName: '',
  //         IsDestination: '',
  //         constrainName: '',
  //       },
  //     ],
  //     IsPrimaryKey: '',
  //     IsForeignKey: '',
  //     field_name: 'newRow',
  //     data_type: '',
  //     additional_constraints: '',
  //   };
  //   setSchemaStore(currentSchema);
  // };
  // renders rows within table
  return (
    <div className="table-node transition-colors duration-500" key={data.table[0]}>
      {tableHandles}
      <div>
        <label htmlFor="text" className="bg-[#075985] dark:opacity-75">
          {data.table[0]}
        </label>
      </div>
      <div>
        <button
          className="add-field text-[#273943] transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
          // onClick={addRow}
        >
          <FaRegPlusSquare size={20} />
        </button>
      </div>
      <div className="table-bg transition-colors duration-500 dark:bg-slate-700">
        <table className="transition-colors duration-500 dark:text-[#fbf3de]">
          <thead>
            <tr className="head-row">
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                Column
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                Type
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                Constraints
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                PK
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                FK
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="empty-row">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {/* generates dynamic rows */}
            {rowData.map((row, index) => (
              <TableNodeRow
                row={row}
                key={`${data.table[0]}-row${index}`}
                id={`${data.table[0]}-row${index}`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
