import React from 'react';
import { useState } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';
import {
 FaRegEdit,
 FaRegTrashAlt,
 FaRegSave,
 FaRegCheckSquare,
 FaRegWindowClose,
} from 'react-icons/fa';
import DataTypeOptions from '../Modals/DataTypeOptions';
import { ColumnSchema, RowsOfData, SQLDataType } from '@/Types';


export default function DataTableNodeColumn({row}: {row: string|number[]}) {
  // const [rowData, setRowData] = useState<RowsOfData>({ ...row });
  //console.log('row',row)

  // const { schemaStore, setSchemaStore, deleteColumnSchema } = useSchemaStore(
  //   (state) => state
  // );
  // const { setEditRefMode } = useSettingsStore((state) => state);


  // // Columns can be in one of three modes: default, edit, or delete
  // const [mode, setMode] = useState('default');


  // const [columnData, setColumnData] = useState<ColumnSchema>({ ...column });


  // const onSave = () => {
  //   const currentSchema = { ...schemaStore };
  //   currentSchema[columnData.TableName][columnData.field_name] = {
  //     ...columnData,
  //     // References was updated by AddReference modal, this avoids that change being overwritten
  //     References: currentSchema[columnData.TableName][columnData.field_name].References,
  //   };
  //   // If column name has changed, delete entry with old column name
  //   if (column.field_name !== columnData.field_name) {
  //     delete currentSchema[column.TableName][column.field_name];
  //   }
  //   setSchemaStore(currentSchema);
  //   setMode('default');
  // };


  // const onDelete = () => {
  //   //declare prior values
  //   const tableRef = columnData.TableName;
  //   const colRef = columnData.field_name;
  //   deleteColumnSchema(tableRef, colRef);
  // };


  // const openAddReferenceModal = () => {
  //   // document.querySelector('#mySideNav').style.width = '400px';
  //   // document.querySelector('#main').style.marginRight = '400px';
  //   setEditRefMode(true, columnData.TableName, columnData.Name);
  // };


  //console.log('row',row)
  //need better way to make unique key  ################
  //const uniqueKey = row[0];
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  //need better way to make unique key  ################
  //   const rowsInTd: (string|number)[] = []
  // for (let i = 0; i < row.length; i++) {
  //   rowsInTd.push(<td>{row[i]}</td>)
  //  }


  // console.log('row', row)
  // console.log(row)


  // console.log( 'heleloooooo', row.filter(key => typeof key !== 'object'))
  return (
    <>
      <tr>
        {/* have to filter out object, because when we first got info, schema info came in and that includes obj.
        but, it re-render automatically with correct data info. Not sure why we get the schema info at first, but at least filter
        method makes it work */}
        {row.filter((key:string|number) => typeof key !== 'object')?.map((eachData: string|number) =>
          <td
            // key={`${row[1]}${eachData}`}
            key={getRandomInt(100000)}
            scope="col"
            className="transition-colors duration-500 dark:text-[#fbf3de]"
          >{eachData}</td>
        )}
        <td className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
        </td>
        {/* <td>{ 'hi'}</td> */}
      </tr>
    </>
  );
}