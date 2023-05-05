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

//if we get the info in obj form, we can grab the value of each and render them!!

export default function DataTableNodeColumn({row}: {row: string|number[]}) {


//####### for CRUD ##########
  const { dataStore } = useDataStore(
   (state) => state
 );
  const [mode, setMode] = useState('default');
  
 //console.log('dataStore in DTNC', dataStore)

  
//####### for CRUD ##########
  //we need better way to generate unique key
 function uniqueKey(max: number) {
   return Math.floor(Math.random() * max);
 }

 // console.log("row in DataTableNodeColumn", row)

  {/* When we first got props/states drilled down here, schema info came in and that includes obj.
  rows cannot render obj =>have to replace object to ""
  but, it re-render automatically with correct data info. Not sure why we get the schema info at first */}
  const updatedRow = []
  for (let i = 0; i < row.length; i++) {
    if (typeof row[i] === "object") {
      updatedRow.push('');
    } else {
      updatedRow.push(row[i])
     }
   }

 return (
    <>
     <tr>
       {/* {row.filter((key:string|number) => typeof key !== 'object')?.map((eachData: string|number) => */}
        {updatedRow.map((eachData: string|number) =>  
       <td
           key={uniqueKey(1000000000)}
           scope="col"
           className="transition-colors duration-500 dark:text-[#fbf3de]"
         >{eachData}</td>
       )}
       <td className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
       </td>
        <td>
         {/* this button should give option to UPDATE/ADD/DELETE elements in row, need to work on onClick function */}
         <button
           id={`$rowEditBtn`}
           // onClick={() => setMode('edit')}
           className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
           data-testid="edit-column"
         >
           <FaRegEdit size={17} />
         </button>
       </td>
       <td>
         {/* this button should DELETE the row, need to work on onClick function */}
         <button
           id={`dataDeleteBtn`}
           className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
           onClick={() => setMode('delete')}
         >
           <FaRegTrashAlt size={17} />
         </button>
      </td>
     </tr>
   </>
  );
}
