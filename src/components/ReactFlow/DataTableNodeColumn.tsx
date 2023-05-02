import React from 'react';

export default function DataTableNodeColumn({row}: {row: string|number[]}) {

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