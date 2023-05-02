import * as React from 'react';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import DataTableNodeColumn from './DataTableNodeColumn';

export default function DataTableNode({ data }) {  //this 'data' is created and passed from createdDataNodes, need DATA, not SCHEMA
  const tableName = data.table[0];
  let firstRow =[]
  let restRowsData = []
  const RowData = Object.values(data.table[1]);
 
  if (RowData[0] !== undefined) {
    firstRow = Object.keys(RowData[0]);
    restRowsData = RowData.map(each => Object.values(each));
  } 

  const [dataTableFirstRow, setDataTableFirstRow] = useState(RowData);

  // function to generate handles on the table by iterating through all
  // schema edges to match source and target handles of edges to handle id
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {
      //make handle placement dynamic, we need to know the row of our source
      let columnNumberSource =
        firstRow.findIndex((obj) => obj.Name === data.edges[i].sourceHandle) + 1;
      if (columnNumberSource === 0) columnNumberSource = 1;
      tableHandles.push(
        <Handle 
          key={`${data.edges[i]}-source-${[i]}`}
          type="source"
          position={Position.Top}
          id={data.edges[i].sourceHandle}
          style={{
            background: 'transparent',
            left: "5%"
          }}
        />
      );
    }
    if (data.edges[i].target === tableName) {
      //make handle placement dynamic, we need to know the row of our target
      let columnNumberTarget =
        firstRow.findIndex((obj) => obj.Name === data.edges[i].targetHandle) + 1;
      if (columnNumberTarget === 0) columnNumberTarget = 1;
      tableHandles.push(
        <Handle 
          key={`${data.edges[i]}-target-${[i]}`}
          type="target"
          position={Position.Bottom}
          id={data.edges[i].targetHandle}
          style={{
            background: 'transparent',
            left: "80%"
          }}
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
      <div
            style={{overflow: "scroll", height: "200px", width: "500px" }}
            className="nowheel"
            >
        <div className="table-bg transition-colors duration-500 dark:bg-slate-700">
          <table className="transition-colors duration-500 dark:text-[#fbf3de]">
            <thead>
              <tr className="head-column">
                {firstRow?.map(each => (
                  <th
                    key={each}
                    scope="col"
                    className="transition-colors duration-500 dark:text-[#fbf3de]"
                  >{each}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {/* generates dynamic columns */}
            {restRowsData.map((row, index) => (
              <DataTableNodeColumn
                row={row}
                key={`${tableName}-column${index}`}
                id={`${tableName}-column${index}`}
              />
            ))}
            </tbody>
          </table>
          </div>
          </div>
      </div>
    );
}

