import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position, HandleProps } from 'reactflow';
import DataTableNodeColumn from './DataTableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';
import useDataStore from '../../store/dataStore';
import useSchemaStore from '../../store/schemaStore';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import informationIcon from '../../../images/informationSqIcon.png';
import useCredentialsStore from '../../store/credentialsStore';
import { Edge, DataNode, DataStore, RowsOfData, Data, dbCredentials } from '@/Types';



export default function DataTableNode({ data} : {data:Data} ) {  //this 'data' is created and passed from createdDataNodes, need DATA, not SCHEMA

  
  const newdata = structuredClone(data);
  const [tableData, setTableData] = useState(newdata.table)
  const { setInputModalState } = useSettingsStore((state) => state);
  const { dataStore, referenceStore } = useDataStore((state) => state);
  const setDataStore = useDataStore((state) => state.setDataStore);
  const setReferenceStore = useDataStore((state) => state.setReferencesStore);
  const { schemaStore } = useSchemaStore((state) => state);
  const { dbCredentials } = useCredentialsStore((state) => state);

  const infoIconStr: string = "Please strictly follow syntax of your database. Ex) leave blank for auto-generating values, primary key must have value, etc. It may cause an error in updating database if you not strictly follow the syntax." 
  
  //split up the table into different parts based on how the data is structured. fetch
  const tableName = tableData[0];
  let firstRow : string[] = []
  let restRowsData : RowsOfData[]|[] = []
  let secondaryFirstRow : string[] = []
  let RowData:(RowsOfData[]) = Object.values(tableData[1]);


 //Used to grab the primary key and foreign keys column in the Table
 let schemaName = schemaStore[`public.${tableName}`];
 let PK :(string|number|null) = null
 let FK :(string|number|null) = null
 let pkVals = new Set();
 for(let key in schemaName){
   if(schemaName[key]['IsForeignKey']) FK = schemaName[key].field_name;
   if(schemaName[key]['IsPrimaryKey']) PK = schemaName[key].field_name;

 }

//loop through all of RowData, grab each primary key value and store it in object<pkVals>

  for(let i = 0; i < RowData.length; i++){
    if(PK !== null){
      pkVals.add(RowData[i][PK]);
    }
  }


/////////////// FOR EDGE CASE CONSTRAINT THAT PREVENT ROW DELETED THAT HAS A FOREIGN KEY REFERENCING TO THAT ROW ////////////
// UseEffect on Mount to grab all the Foreign Key reference and store it in reference store because of constraint, *cant delete the row that has 
// a foreign key referenced to it.
// useEffect(()=>{

//   //loop through all of the schemastore in current table to grab all the schema info referencing foreignkey
//   for(let columnKey in schemaName){
//     if(schemaName[columnKey].References[0]){

//       const toForeignKey = {};
//       const fromForeignKey = new Set();
//       const toTableName:string = schemaName[columnKey].References[0].PrimaryKeyTableName.replace('public.',"");
//       const toColumnName:string = schemaName[columnKey].References[0].PrimaryKeyName;
//       const fromTableName:string = schemaName[columnKey].References[0].ReferencesTableName.replace('public.',"");
//       const fromColumnName:string = schemaName[columnKey].References[0].ReferencesPropertyName;

      
//       //loop throw all of the Rowdata and grab data if there is a corresponding foreign key
//       for(let i = 0; i < RowData.length; i++){
//         if(RowData[i][fromColumnName] !== null){
//           fromForeignKey.add(RowData[i][fromColumnName]);
//         }
//       }
//       //assign to the state reference store
//       toForeignKey[toTableName] = {[toColumnName]:fromForeignKey};
//       const currentRef = structuredClone(referenceStore);
//       //console.log('prereference' ,referenceStore) 
//       setReferenceStore({...currentRef,...toForeignKey});
//       //console.log('post reference',referenceStore) //// ** State of referenceStore is not updating right away after setting referenceStore, only update on page mount?
//     }
//    }
//  },[dataStore])
//////////////////////////////////////////////////////


//check if
  if (schemaName !== undefined) {
    secondaryFirstRow = Object.keys(schemaStore['public.' + tableName]);
  }

 //Filter out Schemas from data, not sure why schema data would show sometime.
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


 const deleteRow = async (value:RowsOfData,index:number,id:number|string):Promise<void> =>  {


////////////////////////// CHECK TO SEE IF IT HAS A REFERENCE FOREIGN KEY BEFORE DELETE/////////////
//loop through all of deleteRow values and check if there is a corresponding referenceStore, if so throw error because it has a corresponding foreign key. 
//   for(let col in value){
//   if(referenceStore[id] !== undefined ){
//     if(referenceStore[id][col] !== undefined ){
//       if(referenceStore[id][col].has(value[col])){
//         alert(`Can't Delete Foreign Key: ${col}`);
//         throw new Error(`Can't Delete Foreign Key: ${col}`);
//       }
//     }
//   }
// }
/////////////////////////////////////////////////////////////////////////
  
const newDatastore = structuredClone(dataStore)

  restRowsData = restRowsData.slice(0,index).concat(restRowsData.slice(index+1,restRowsData.length))

  newDatastore[tableName] = restRowsData
   setDataStore({...newDatastore,[id]:restRowsData});
     await fetch(`/api/sql/${dbCredentials.db_type}/deleteRow`, {
       method: 'DELETE',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ tableName: tableName, value: value })
     })
      .then((res) => {
      //console.log("deleting row info sent")
        return res
      })
      .catch((err: ErrorEvent) => { console.error('deleting row error', err) })
  };

  
//cannot make handles for data table dynamic since size of each column can vary
//TODO: is there better way to assign handle? more dynamic?
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-source-${[i]}`}
          type="source"
          position={Position.Top}
          id={data.edges[i].sourceHandle}
          style={{
            background: 'transparent',
            left: "70%"
          }}
        />
      );
    }
    if (data.edges[i].target === tableName) {
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-target-${[i]}`}
          type="target"
          position={Position.Top}
          id={data.edges[i].targetHandle}
          style={{
            background: 'transparent',
            left: "4%"
          }}
        /> 
      );
    }
  }

  return (
    <>
      <div className="table-node transition-colors duration-500" key={tableName}>
        <div className="flex items-center justify-between table-header relative bg-[#075985] dark:opacity-75">
          {tableHandles}
          <div>
            <label htmlFor="text"
              className="bg-[#075985] dark:opacity-75 text-white text-stroke-black dark:bg-opacity-0"
              style={{
                'marginLeft': '0px'
              }}>
              {tableName}
            </label>
          </div>
          <div className="addRowBtn ml-3 mb-1.5 flex position">
            <button
              className="add-field transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7] bg-transparent"
              onClick={() => setInputModalState(true, 'row', tableName)}
            >
              <FaRegPlusSquare size={20} className="text-white" />
            </button>
            <div className='mt-2 mr-2'>
              <Tippy content={infoIconStr} placement="top" trigger="mouseenter click">
                <img src={informationIcon} alt="Information Icon" className="h-3 rounded-full ml-0" />
              </Tippy>
            </div>
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
                    ><b>{each}</b>
                    </th>
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
                      PK={[PK,pkVals]}
                    />
                  )}
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}