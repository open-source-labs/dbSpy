import React from 'react';
import { useState, useEffect } from 'react';
import useCredentialsStore from '../../store/credentialsStore';
import { FaRegEdit, FaRegTrashAlt, FaRegSave, FaRegCheckSquare, FaRegWindowClose } from 'react-icons/fa';
import { RowsOfData } from '@/Types';
import useSchemaStore from '../../store/schemaStore';

// type RowData = {
//   [key: string]: string | number;
// }

type DataTableNodeColumnProp = {
  row: RowsOfData,
  id?: string|number,
  deleteRow: (rowData:RowsOfData,index:number,id?:string|number)=>void,
  index: number,
  PK: [string|number|null,Set<unknown>|null],
};

export default function DataTableNodeColumn({row, id, deleteRow, index, PK}: DataTableNodeColumnProp) {


// we need a tempData and rowData as seperate states because if the edit was canceled need to revert back to original state prior to change.
  const newRow = structuredClone(row);
  const [rowData, setRowData] = useState({ ...newRow });
  const [tempData, setTempData] = useState({ ...newRow });
  const { dbCredentials } = useCredentialsStore((state) => state);
  const { schemaStore } = useSchemaStore((state) => state);

//reset the state when row changes. Specifically for on-delete functionality. 
  useEffect(()=> {
    setRowData({...newRow});
    setTempData({...newRow});
    }, [row])


  const [mode, setMode] = useState('default');

  const rowDataKeys = Object.keys(row);

  interface rowData {
    [key: string | number]: string | number | boolean | null
  };
  interface tempData {
    [key: string | number]: string | number | boolean | null
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
    changes.newRow = {...tempData};

    let primaryKeyData: {[key: string | number]: (string | number | boolean | null)} | null = null;
    if (schemaStore.hasOwnProperty(id!)) {
      const tableData = schemaStore[id!];
      for (const columnName in tableData) {
        const column = tableData[columnName];
        if (column.IsPrimaryKey) {
          primaryKeyData = {[columnName]: changes.newRow[columnName]}
          delete changes.newRow[columnName];
        }
      }
    } else {
      console.log('Table not found in schemaStore');
      console.error('The Table Does not have a Primary Key, Cannot update without one')
      return;
    }

    changes.primaryKey = primaryKeyData!
    setRowData({...tempData});
    setMode('default');

    await fetch(`/api/sql/${dbCredentials.db_type}/updateRow`,{
      method:'PATCH',
      headers:{
        'Content-Type': 'application/json'
        },
        body:JSON.stringify(changes)
      })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log('ERROR: ', err);
      })
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
