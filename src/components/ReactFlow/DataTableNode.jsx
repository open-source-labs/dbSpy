//das is working on this...... help.....

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import DataTableNodeColumn from './DataTableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';

export default function DataTableNode({ data }) {  //this 'data' is created and passed from createdDataNodes, need DATA, not SCHEMA
  const tableName = data.table[0];
  console.log('inside tableNodeForData file', data);
  // columnData is an array of objects with each column in the table as an element
  const RowData = Object.values(data.table[1]);
  const firstRow = Object.keys(RowData[0]) //arr of obj
  //const restRows = data inside the rows ###############################
  const restRowsData = RowData.map(each => Object.values(each));
  // const restRows = restRowsData.map(each => Object.values(each))
  console.log("data.table", data.table);
  console.log("tableName",tableName)
  console.log("RowData", RowData);
  console.log('firstRow', firstRow)
  console.log("restRowsData", restRowsData); //each inside this array need to render as each column inside the table
  // console.log("restRows", restRows);


  restRowsData?.forEach(eachRow => {
    eachRow.map(eachColumn => (
      console.log('eachColumn', eachColumn)))})

  //console.log('arrOfRows',Object.keys(data.table))


  const [dataTableFirstRow, setDataTableFirstRow] = useState(RowData);
  // const [tableColumns, setTableColumns] = useState(columnData);
  // const { setInputModalState } = useSettingsStore((state) => state);

  // function to generate handles on the table by iterating through all
  // schema edges to match source and target handles of edges to handle id
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {
      //make handle placement dynamic, we need to know the column of our source
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
            top: 77 + columnNumberSource * 21,
            // bottom: 'auto',
          }}
        />
      );
    }
    if (data.edges[i].target === tableName) {
      //make handle placement dynamic, we need to know the column of our target
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
            top: 77 + columnNumberTarget * 21,
            // bottom: 'auto',
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
                {/* <th>top column</th> */}
              </tr>

              {/* need for loop/map to render each row!! */}
              {/* <tr>
                {restRowsData?.forEach(eachRow => {
                  eachRow.map(eachColumn => (
                    <th
                    key={eachColumn}
                    scope="col"
                    className="transition-colors duration-500 dark:text-[#fbf3de]"
                  >{eachColumn}</th>
                  ))
                 })}
              </tr> */}
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
    );
  
}
