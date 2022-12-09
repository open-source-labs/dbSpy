import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import TableNodeColumn from './TableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';

export default function TableNode({ data }) {
  const tableName = data.table[0];
  // columnData is an array of objects with each column in the table as an element
  const columnData = Object.values(data.table[1]);
  const [tableColumns, setTableColumns] = useState(columnData);
  const { setInputModalState } = useSettingsStore((state) => state);
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
  // renders columns within table
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
          // onClick={addColumn}
          onClick={() => setInputModalState(true, 'column', tableName)}
        >
          <FaRegPlusSquare size={20} />
        </button>
      </div>
      <div className="table-bg transition-colors duration-500 dark:bg-slate-700">
        <table className="transition-colors duration-500 dark:text-[#fbf3de]">
          <thead>
            <tr className="head-column">
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
            {/* generates dynamic columns */}
            {columnData.map((column, index) => (
              <TableNodeColumn
                column={column}
                key={`${tableName}-column${index}`}
                id={`${tableName}-column${index}`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
