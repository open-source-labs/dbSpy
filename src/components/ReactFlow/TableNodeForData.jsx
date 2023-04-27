//das is working on this...... help.....

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import TableNodeColumn from './TableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';

export default function TableNodeForData({ data }) {  //this 'data' is created and passed from createdDataNodes
  const tableName = data.table[0];
  console.log('inside tableNodeForData file')
  // columnData is an array of objects with each column in the table as an element
  const firstRowData = Object.keys(data.table[1]); //arr of obj
  //const restRows = data inside the rows ###############################
  const restRowsData = "data inside the rows"
  console.log("data.table", data.table)
  console.log("firstRowData", firstRowData); //each inside this array need to render as each column inside the table
  console.log("restRowsData", restRowsData)

  const [dataTableFirstRow, setDataTableFirstRow] = useState(firstRowData);
  // const [tableColumns, setTableColumns] = useState(columnData);
  // const { setInputModalState } = useSettingsStore((state) => state);

  // function to generate handles on the table by iterating through all
  // schema edges to match source and target handles of edges to handle id
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {
      //make handle placement dynamic, we need to know the column of our source
      let columnNumberSource =
        firstRowData.findIndex((obj) => obj.Name === data.edges[i].sourceHandle) + 1;
      if (columnNumberSource === 0) columnNumberSource = 1;
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-source-${[i]}`}
          type="source"
          position={Position.Top}
          id={data.edges[i].sourceHandle}
          style={{
            background: 'transparent',
            top: 77 + columnNumberSource * 21,
            // bottom: 'auto',
          }}
        />
      );
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
        <div className="table-bg transition-colors duration-500 dark:bg-slate-700">
          <table className="transition-colors duration-500 dark:text-[#fbf3de]">
            <thead>
              <tr className="head-column">
                {firstRowData?.map(each => (
                  <th
                    key={each}
                    scope="col"
                    className="transition-colors duration-500 dark:text-[#fbf3de]"
                  >{each}</th>
                ))}
                {/* <th>top column</th> */}
              </tr>
              <tr>
                <th>{restRowsData}</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    );
  }
}