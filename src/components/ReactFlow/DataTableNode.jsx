import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import DataTableNodeColumn from './DataTableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';
import useDataStore from '../../store/dataStore';
import useSchemaStore from '../../store/schemaStore';
import useCredentialsStore from '../../store/credentialsStore';


export default function DataTableNode({ data }) {  //this 'data' is created and passed from createdDataNodes, need DATA, not SCHEMA

  const [tableData, setTableData] = useState(data.table)


  const { dataStore, addTableData} = useDataStore(
    (state) => state
  );
  const{schemaStore} = useSchemaStore((state) => state);

  const setDataStore = useDataStore((state) => state.setDataStore);
  const { dbCredentials } = useCredentialsStore((state) => state);



 const tableName = tableData[0];
 let firstRow =[]
 let restRowsData = []
 let secondaryFirstRow = []
 let RowData = Object.values(tableData[1]);

 //Used to grab the primary key value in the Table
 let schemaName = schemaStore[`public.${tableName}`];
 let PK = null;
 for(let key in schemaName){
   if(schemaName[key]['IsPrimaryKey']) PK = schemaName[key].field_name;
 }

 if (schemaName !== undefined) {
  secondaryFirstRow = Object.keys(schemaStore['public.' + tableName]);
  //console.log(secondaryFirstRow);
}

 //Filter out Schemas from data
 if(RowData[0] !== undefined){
  if (RowData[0].IsForeignKey === undefined) {
    firstRow = Object.keys(RowData[0]);
    restRowsData = [...RowData];
  }
 }else{
  firstRow = secondaryFirstRow
 }

//UseEffect set Table when the dataStore is changed after on Delete.
 useEffect(() => {  
  setTableData([tableName,dataStore[tableName]])

}, [dataStore]);



 const deleteRow = async (value,index,id) => {
 
  restRowsData = restRowsData.slice(0,index).concat(restRowsData.slice(index+1,restRowsData.length))
  
   setDataStore({...dataStore,[id]:restRowsData});

  const sendDeleteRequest = fetch(`/api/${dbCredentials.db_type}/deleteRow`,{
    method:'DELETE',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({tableName : tableName, primaryKey: PK, value: value[PK] })
  })
  
  ////////////////// Fetch path: /api/delete ///////////////////
  // {
  //  tableName: name of table,
  //  primaryKey: primary key,
  //  value: corresponding value of the primary key
  // }
  ////////////////////////////////////////////
 }


  const { setInputModalState } = useSettingsStore((state) => state);

  //console.log(schemaStore)
//  const [dataTableFirstRow, setDataTableFirstRow] = useState(RowData);








  //console.log('HERE!!!!!!!!',remainingRows)
//   const remainingRows = Object.values(data.table[1]);
//  if (RowData[0] !== undefined) {
//    firstRow = Object.keys(remainingRows[0]);
//   restRowsData = remainingRows.map(each => Object.values(each));
//   // console.log(restRowsData)
//  }

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
           left: "60%"
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
           left: "5%"  //need to fix this for dynamic handles
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
  {/* <NodeResizer minWidth={100} minHeight={30} /> */}
  {tableHandles}
  <div>
    <label htmlFor="text" 
    className="bg-[#075985] dark:opacity-75 text-white text-stroke-black dark:bg-opacity-0" 
    style={{ 
      'margin-left': '0px'
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
          {restRowsData.map((row, index) =>{
            return (
            <DataTableNodeColumn
              row={row}
              key={`${tableName}-row${index}`}
              id={tableName}
              index={index}
              deleteRow={deleteRow}
            />
          )} )}
        </tbody>
      </table>
    </div>
  </div>
</div>
</>
 );
}
