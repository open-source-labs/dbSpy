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

export default function DataTableNodeColumn({row,id}: {row:RowData, id:string|number}) {



//####### for CRUD ##########
  const { dataStore } = useDataStore(
   (state) => state
 );
const [mode, setMode] = useState('default');


const rowDataKeys = Object.keys(row)

const [rowData, setRowData] = useState({ ...row });


//####### for CRUD ##########
  //we need better way to generate unique key
 function uniqueKey(max: number) {
   return Math.floor(Math.random() * max);
 }

 // useEffect(()=> {
//   if(mode === 'default')   console.log("HELLO");
// },[])


return (
  <tr key={id} className="dark:text-[#f8f4eb]">

    {rowDataKeys.map((element:string|number,ind:number) => 
        <td className="dark:text-[#f8f4eb]" key={`${id}-${ind}`} val={`${id}-col${element}`}> 
        { mode === 'edit'?
        (<input className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black" value={rowData[element]} 
        onChange={(e)=>
          setRowData((prevData) =>  ({
            ...prevData,
            [element]: e.target.value
          }))}
        ></input>):
        (row[element])
        }
        </td>
    )}
    <td>{
      mode ==='default'?
            (<button val={`${id}-rowEditBtn`} onClick={()=>setMode('edit')} className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
              <FaRegEdit size={17} />
            </button>):
          mode==='edit'?
            (<button val={`${id}-rowSaveBtn`} className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
                <FaRegSave size={17} />
              </button>):
            (<button val={`${id}-rowCheckBtn`} className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
              <FaRegCheckSquare size={17} />
            </button>)
      }
    </td>
    <td>
      {
        mode ==='default'?
        (<button id={`${id}-rowDeleteBtn`} className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]" >
        <FaRegTrashAlt size={17} />
      </button>):
        (<button id={`${id}-cancelBtn`}>
                  
              <FaRegWindowClose size={17} />
        </button>)
      }

    </td>

  </tr>
 
  );
}
