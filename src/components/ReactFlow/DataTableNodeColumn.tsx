import React from 'react';
import { useState, useEffect } from 'react';
import useDataStore from '../../store/dataStore';
import useCredentialsStore from '../../store/credentialsStore';
import { FaRegEdit, FaRegTrashAlt, FaRegSave, FaRegCheckSquare, FaRegWindowClose } from 'react-icons/fa';
import { identity } from 'cypress/types/lodash';
import { RowsOfData } from '@/Types';

type RowData = {
  [key: string]: string | number
}

type DataTableNodeColumnProp = {
  row:RowsOfData,
  id?: string|number,
  deleteRow:(rowData:RowsOfData,index:number,id?:string|number)=>void,
  index:number,
  PK:[string|number|null,Set<unknown>|null],
}

export default function DataTableNodeColumn({row,id,deleteRow,index, PK}: DataTableNodeColumnProp) {


// we need a tempData and rowData as seperate states because if the edit was canceled need to revert back to original state prior to change.
  const newRow = structuredClone(row);
  const [rowData, setRowData] = useState({ ...newRow });
  const [tempData, setTempData] = useState({ ...newRow });
  const { dbCredentials } = useCredentialsStore((state) => state);

//reset the state when row changes. Specifically for on-delete functionality. 
  useEffect(()=> {
    setRowData({...newRow});
    setTempData({...newRow});
    },[row])


  const [mode, setMode] = useState('default');

  const rowDataKeys = Object.keys(row);

  interface rowData {
    [key:string|number]:string|number|boolean|null
  };
  interface tempData {
    [key:string|number]:string|number|boolean|null
  };
  interface changes{
    newRow?: tempData;
    primaryKey?: tempData;
    tableName?: string|number;
  };

  const onCancel = () => {
    setTempData(rowData);
    setMode('default');
  };

//on save suppose to save changes to edits on data row.
const onSave = async () => {
  
  //create changes object to store all the data needed to send to the backend
  const changes: changes = {};
  changes.tableName = id;
  changes.newRow= {...tempData};
  //if statement necessary for typing correction
  if(PK[0] !== null && changes.newRow!== undefined){
    changes.primaryKey = {[PK[0]]:changes.newRow[PK[0]]}
  };
  //delete primary key column from change for fetch request row.
  if(PK[0]) delete changes.newRow[PK[0]];
 

  //iterate through and find the changes between new and old data.
  const checkConstraints:tempData = {}
  for(let currentKey in tempData ){
    if(tempData[currentKey] !== rowData[currentKey]){
      checkConstraints[currentKey] =tempData[currentKey]
    };
  };

  //High level idea is to prevent edits into a matching primary key of the same table.
  //Change all values in set into string in order to check if changed values(string) exist in primary key constraints(string)
  if(PK[1]){
    const tempObj = []
    for(const setItem of PK[1]){
      if(typeof setItem === 'number'){
        tempObj.push(setItem.toString());
        PK[1].delete(setItem);
      };
    };
    tempObj.forEach((curr)=> PK[1]?.add(curr))
  
    for(let currentKey in checkConstraints ){
      if(PK[0] === currentKey && PK[1].has(checkConstraints[currentKey])){
        alert(`Duplicate Primary Key: ${PK[0]}`);
        setTempData(rowData);
        setMode('default');
        throw new Error('Duplicate Primary Key');
      };
    };
  };

  
  setRowData({...tempData});
  setMode('default');
  


  const sendChangesRequest = await fetch(`/api/sql/${dbCredentials.db_type}/updateRow`,{
    method:'PATCH',
    headers:{
      'Content-Type': 'application/json'
      },
      body:JSON.stringify(changes)
    });
    const data = await sendChangesRequest.json()
    console.log(data);
  };

/////////////////////////////////
// Patch Request edit Data endpoint: /api/updateRow
// Body: {
//  newRow:{new updated row},
//  tableName: name of the table
//  }
////////////

//setTemp data at the current column element to its value based whenever changed.
  return (
    <tr key={id} className="dark:text-[#f8f4eb]">
      {rowDataKeys.map((element:string|number,ind:number) => 
        <td className="dark:text-[#f8f4eb]" key={`${id}-${ind}`} > 
          {mode === 'edit'?
            (<input className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black" value={tempData[element] as string|number|undefined} 
              onChange={(e)=>{
                setTempData((prevData:rowData) =>  ({
                  ...prevData,
                  [element]: e.target.value
                }))
              }}
            ></input>):
            (rowData[element])
          }
        </td>
      )}
      <td>
        {mode ==='default'?
          (<button onClick={()=>setMode('edit')} className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
            <FaRegEdit size={17} />
          </button>):
          mode==='edit'?
            (<button  onClick={onSave} 
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
                <FaRegSave size={17} />
              </button>):
            (<button onClick={() =>{ 
              deleteRow(rowData,index,id);
              setMode('default');
              }}className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
              <FaRegCheckSquare size={17} />
            </button>)
        }
      </td>
      <td>
        {mode ==='default'?
          (<button id={`${id}-rowDeleteBtn`} onClick={()=>setMode('trash')}className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
            <FaRegTrashAlt size={17} />
          </button>):
          (<button id={`${id}-cancelBtn`} onClick={onCancel}>   
            <FaRegWindowClose size={17} />
          </button>)
        }
      </td>
    </tr>
  );
}
