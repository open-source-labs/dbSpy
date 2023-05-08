import * as React from 'react';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import DataTableNodeColumn from './DataTableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';
import useDataStore from '../../store/dataStore';
import useSchemaStore from '../../store/schemaStore';

export default function DataTableNode({ data }) {  //this 'data' is created and passed from createdDataNodes, need DATA, not SCHEMA

  const { setInputModalState } = useSettingsStore((state) => state);
  const { schemaStore } = useSchemaStore((state) => state);

  const tableName = data.table[0];
 let firstRow =[]
  let restRowsData = []
  let secondaryFirstRow = []

  if (schemaStore['public.' + tableName] !== undefined) {
    secondaryFirstRow = Object.keys(schemaStore['public.' + tableName]);
  }

   const RowData = Object.values(data.table[1]);
  if (RowData[0] !== undefined) {
    firstRow = Object.keys(RowData[0]);
    restRowsData = RowData.map(each => Object.values(each));
  } else {
    firstRow = secondaryFirstRow
   }
  //console.log('HERE!!!!!!!!',remainingRows)
//   const remainingRows = Object.values(data.table[1]);
//  if (RowData[0] !== undefined) {
//    firstRow = Object.keys(remainingRows[0]);
//   restRowsData = remainingRows.map(each => Object.values(each));
//   // console.log(restRowsData)
//  }
console.log(tableName)  
  console.log(data.edges)
console.log(firstRow)  
//cannot make handles for data table dynamic since size of each column can vary
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {
      let columnNumberSource =
        firstRow.findIndex((eachColumnName) => eachColumnName === data.edges[i].sourceHandle) + 1;
      console.log('columnNumberSource',columnNumberSource)
      if (columnNumberSource === 0) columnNumberSource = 1;
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-source-${[i]}`}
          type="source"
          position={Position.Top}
          id={data.edges[i].sourceHandle}
          style={{
            background: 'transparent',
            // left: "25%" + ((columnNumberSource - 1) * 30)
            left: 62 + ((columnNumberSource-1)* 40)
          }}
        />
      );
    }
    if (data.edges[i].target === tableName) {
      let columnNumberTarget =
        firstRow.findIndex((obj) => obj.Name === data.edges[i].targetHandle) + 1;
      console.log("columnNumberTarget", columnNumberTarget)
      if (columnNumberTarget === 0) columnNumberTarget = 1;
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-target-${[i]}`}
          type="target"
          position={Position.Top}
          id={data.edges[i].targetHandle}
          style={{
            background: 'transparent',
            left: 15
          }}
        />
      );
    }
  }
 // renders columns within table
 return (
<>
  <div className="table-node transition-colors duration-500" key={tableName}>
  <div className="flex items-center justify-between table-header relative bg-[#075985] dark:opacity-75">
  {tableHandles}
  <div>
    <label htmlFor="text" 
    className="bg-[#075985] dark:opacity-75 text-white text-stroke-black dark:bg-opacity-0" 
    style={{ 
      padding: '0.5rem 1rem',
       }}>
      {tableName}
    </label>
  </div>
    <div className="addRowBtn ml-3 mb-1.5">
      <button
        className="add-field transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7] bg-transparent"
        onClick={() => setInputModalState(true, 'row', tableName)}
      >
        <FaRegPlusSquare size={20} className="text-white" />
      </button>
    </div>
</div>
  <div
    style={{ maxHeight: "350px", maxWidth: "600px" }}
    className="nowheel overflow-auto scrollbar-hide"
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
              ><b>{each}</b></th>
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
</>
 );
}
