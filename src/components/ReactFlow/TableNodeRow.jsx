import React from 'react';
import { Handle, Position } from 'reactflow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function TableNodeRow({ row }) {
  // had to convert booleans to strings or they wont show up on table
  console.log('Im in tableNodeRow, here is row data: ', row);
  return (
      <tr key={row.field_name} className='dark:text-white'>
        <td className='dark:text-white'>{row.field_name}</td>
        <td className='dark:text-white'>{row.data_type}</td>
        <td className='dark:text-white'>{row.additional_constraints}</td>
        <td className='dark:text-white'>{row.IsPrimaryKey.toString()}</td>
        <td className='dark:text-white'>{row.IsForeignKey.toString()}</td>
        <td>
          <button className="icon">
            <EditIcon className="icon-class dark:fill-white" />
          </button>
        </td>
        <td>
          <button className="icon">
            <DeleteIcon className="icon-class dark:fill-white" />
          </button>
        </td>
      </tr>
  );
}
