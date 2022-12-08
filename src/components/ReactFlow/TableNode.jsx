import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import TableNodeRow from './TableNodeRow';
import InputModal from '../Modals/InputModal';
import useSchemaStore from '../../store/schemaStore';
import { FaRegPlusSquare } from 'react-icons/fa';

export default function TableNode({ data }) {
  const tableName = data.table[0];
  // rowData is an array of objects with each row in the table as an element
  const rowData = Object.values(data.table[1]);
  const [tableRows, setTableRows] = useState(rowData);
  // function to generate handles on the table by iterating through all
  // schema edges to match source and target handles of edges to handle id
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {
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
    if (data.edges[i].target === tableName) {
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
  // renders rows within table
  return (
    <div className="table-node transition-colors duration-500" key={tableName}>
      {tableHandles}
      <div>
        <label htmlFor="text" className="bg-[#075985] dark:opacity-75">
          {tableName}
        </label>
      </div>
      <div>
        <button
          className="add-field text-[#273943] transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
          // onClick={addRow}
          onClick={() => data.openAddColumnModal(tableName)}
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
                key={`${tableName}-row${index}`}
                id={`${tableName}-row${index}`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
