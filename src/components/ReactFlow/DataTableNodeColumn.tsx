import React from 'react';
import { useState } from 'react';
import useDataStore from '../../store/dataStore';
import {
 FaRegEdit,
 FaRegTrashAlt,
 FaRegSave,
 FaRegCheckSquare,
 FaRegWindowClose,
} from 'react-icons/fa';

type RowData = {
  [key: string]: string | number
}

export default function DataTableNodeColumn({row,id,deleteRow,index}: {row:RowData, id:string|number,deleteRow:(rowData:RowData,index:number)=>void,index:number}) {

//####### for CRUD ##########

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

const [rowData, setRowData] = useState({ ...row });
const [tempData, setTempData] = useState({ ...row });


const onCancel = () => {
  setTempData(rowData);
  setMode('default');
}

const onSave = async () => {
  const changes: changes= {};
  for(let currentKey in tempData ){
    if(tempData[currentKey] !== rowData[currentKey]){
      changes[currentKey] =tempData[currentKey]
    }
  }
  changes.DbSpyoriginal= {...rowData}

  
  setRowData({...tempData});
  setMode('default');
  

  const sendChangesRequest = await fetch('/api/changes',{
    method:'PATCH',
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(changes)
  });
  const data = await sendChangesRequest.json()
  console.log(data);

}

 // useEffect(()=> {
//   if(mode === 'default')   console.log("HELLO");
// },[])


return (
  <tr key={id} className="dark:text-[#f8f4eb]">

    {rowDataKeys.map((element:string|number,ind:number) => 
        <td className="dark:text-[#f8f4eb]" key={`${id}-${ind}`} val={`${id}-col${element}`}> 
        { mode === 'edit'?
        (<input className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black" value={tempData[element]} 
        onChange={(e)=>{
          setTempData((prevData) =>  ({
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
            (<button val={`${id}-rowEditBtn`} onClick={()=>setMode('edit')} className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
              <FaRegEdit size={17} />
            </button>):
          mode==='edit'?
            (<button val={`${id}-rowSaveBtn`} onClick={onSave} 
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
                <FaRegSave size={17} />
              </button>):
            (<button val={`${id}-rowCheckBtn`} onClick={() => deleteRow(rowData,index)}className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
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
