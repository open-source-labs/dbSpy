import React from 'react';
import { useState } from 'react';
import useDataStore from '../../store/dataStore';

export default function DataTableNodeColumn({row}: {row: string|number[]}) {

//####### for CRUD ##########
   const { dataStore } = useDataStore(
    (state) => state
  );
const [mode, setMode] = useState('default');


//####### for CRUD ##########
  
  //we need better way to generate unique key
  function uniqueKey(max: number) {
    return Math.floor(Math.random() * max);
  }

  return (
    <>
      <tr>
        {/* have to filter out object, because when we first got info, schema info came in and that includes obj.
        but, it re-render automatically with correct data info. Not sure why we get the schema info at first, but at least filter
        method makes it work */}
        {row.filter((key:string|number) => typeof key !== 'object')?.map((eachData: string|number) =>
          <td
            key={uniqueKey(1000000000)}
            scope="col"
            className="transition-colors duration-500 dark:text-[#fbf3de]"
          >{eachData}</td>
        )}
        <td className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
        </td>
      </tr>
    </>
  );
}