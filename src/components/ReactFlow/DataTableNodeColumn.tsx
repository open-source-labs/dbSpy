import React from 'react';
import { useState, useEffect } from 'react';
import useDataStore from '../../store/dataStore';
import useCredentialsStore from '../../store/credentialsStore';
import {
 FaRegEdit,
 FaRegTrashAlt,
 FaRegSave,
 FaRegCheckSquare,
 FaRegWindowClose,
} from 'react-icons/fa';
import { identity } from 'cypress/types/lodash';

type RowData = {
  [key: string]: string | number
}

export default function DataTableNodeColumn({row,id,deleteRow,index}: {row:RowData, id:string|number,deleteRow:(rowData:RowData,index:number,id:string)=>void,index:number}) {

//####### for CRUD ##########

const newRow = JSON.parse(JSON.stringify(row));

const [rowData, setRowData] = useState({ ...newRow });
const [tempData, setTempData] = useState({ ...newRow });
const { dbCredentials } = useCredentialsStore((state) => state);

//reset the state when row changes. Specifically for on-delete functionality. 
useEffect(()=> {
  setRowData({...newRow})
  setTempData({...newRow})
  },[row])

const [mode, setMode] = useState('default');


const rowDataKeys = Object.keys(row)

interface rowData {
  [key:string|number]:string|number
}
interface tempData {
  [key:string|number]:string|number
}
interface changes{
  [key:string|number]:string|number|tempData
}




const onCancel = () => {
  setTempData(rowData);
  setMode('default');
}

const onSave = async () => {
  const changes: changes= {};
  changes.tableName = id
  changes.newRow= {...tempData}
  console.log(changes);

  
  setRowData({...tempData});
  setMode('default');
  


  const sendChangesRequest = await fetch(`/api/${dbCredentials.db_type}/updateRow`,{
  

    method:'PATCH',
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(changes)
  });
  const data = await sendChangesRequest.json()
  console.log(data);
}

/////////////////////////////////
// Patch Request edit Data endpoint: /api/updateRow
// Body: {
//  newRow:{new updated row},
//  tableName: name of the table
//  }
////////////


return (
  <tr key={id} className="dark:text-[#f8f4eb]">

    {rowDataKeys.map((element:string|number,ind:number) => 
        <td className="dark:text-[#f8f4eb]" key={`${id}-${ind}`} > 
        { mode === 'edit'?
        (<input className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black" value={tempData[element]} 
        onChange={(e)=>{
          setTempData((prevData:rowData) =>  ({
            ...prevData,
            [element]: e.target.value
          }))
        }
    }
        ></input>):
        (rowData[element])
        }
        </td>
    )}
    <td>{
      mode ==='default'?
            (<button onClick={()=>setMode('edit')} className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
              <FaRegEdit size={17} />
            </button>):
          mode==='edit'?
            (<button  onClick={onSave} 
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
                <FaRegSave size={17} />
              </button>):
            (<button onClick={() =>{ deleteRow(rowData,index,id)}}className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
              <FaRegCheckSquare size={17} />
            </button>)
      }
    </td>
    <td>
      {
        mode ==='default'?
        (<button id={`${id}-rowDeleteBtn`} onClick={()=>setMode(id)}className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
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
