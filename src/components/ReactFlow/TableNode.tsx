import * as React from 'react';
import { Handle, Position } from 'reactflow';
import TableNodeColumn from './TableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';

export default function TableNode({ data }) {
  const tableName = data.table[0];
  // columnData is an array of objects with each column in the table as an element
  const columnData = Object.values(data.table[1]);
  // const [tableColumns, setTableColumns] = useState(columnData);
  const { setInputModalState } = useSettingsStore((state) => state);

  // function to generate handles on the table by iterating through all
  // schema edges to match source and target handles of edges to handle id
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {  
      //make handle placement dynamic, we need to know the column of our source
      let columnNumberSource =
        columnData.findIndex((obj) => obj.Name === data.edges[i].sourceHandle) + 1;
      if (columnNumberSource === 0) columnNumberSource = 1;
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-source-${[i]}`}
          type="source"
          position={Position.Right}
          id={data.edges[i].sourceHandle}
          style={{
            background: 'transparent',
            top: 67 + ((columnNumberSource-1)*24),
            // bottom: 'auto',
          }}
        />
      );
    }
    if (data.edges[i].target === tableName) {
      //make handle placement dynamic, we need to know the column of our target
      let columnNumberTarget =
        columnData.findIndex((obj) => obj.Name === data.edges[i].targetHandle) + 1;
      //console.log("columnNumberTarget", columnNumberTarget)
      if (columnNumberTarget === 0) columnNumberTarget = 1;
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-target-${[i]}`}
          type="target"
          position={Position.Left}
          id={data.edges[i].targetHandle}
          style={{
            background: 'transparent',
            top: 67 + ((columnNumberTarget-1)*24),
            // bottom: 'auto',
          }}
        />
      );
    }
  }

  // renders columns within table
  return (
    <>
      <div className="table-node transition-colors duration-500" key={tableName}>
        <div className="flex items-center justify-between table-header relative bg-[#075985] dark:bg-opacity-75">
          {/* <NodeResizer minWidth={100} minHeight={30} /> */}
          {tableHandles}
          <div>
            <label
            htmlFor="text"
            className="bg-[#075985] text-white text-stroke-black dark:bg-opacity-0"
            style={{
             'marginLeft': '0px'
            }}
          >
      {tableName}
    </label>
  </div>
    <div className="addRowBtn ml-3 mb-1.5">
      <button
        className="add-field transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7] bg-transparent"
        onClick={() => setInputModalState(true, 'column', tableName)}
      >
        <FaRegPlusSquare size={20} className="text-white" />
      </button>
    </div>
</div>

<div
    style={{ maxHeight: "400px", maxWidth: "600px" }}
    className="nowheel overflow-auto"
  >
      <div className="table-bg transition-colors duration-500 dark:bg-slate-700">
        <table className="transition-colors duration-500 dark:text-[#fbf3de]">
          <thead>
            <tr className="head-column">
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                <b>Column</b>
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                <b>Type</b>
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                <b>Constraints</b>
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                <b>PK</b>
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                <b>FK</b>
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
    </div>
    </>
  );
}

