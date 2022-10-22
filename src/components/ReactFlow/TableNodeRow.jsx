import React from 'react';
import { Handle, Position } from 'reactflow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function TableNodeRow({ row }) {
  // had to convert booleans to strings or they wont show up on table
  console.log('Im in tableNodeRow, here is row data: ', row);
  return (
      <tr key={row.field_name} className='dark:text-[#f8f4eb]'>
        <td className='dark:text-[#f8f4eb]'>{row.field_name}</td>
        <td className='dark:text-[#f8f4eb]'>{row.data_type}</td>
        <td className='dark:text-[#f8f4eb]'>{row.additional_constraints}</td>
        <td className='dark:text-[#f8f4eb]'>{row.IsPrimaryKey.toString()}</td>
        <td className='dark:text-[#f8f4eb]'>{row.IsForeignKey.toString()}</td>
        <td>
          <button className="icon">
            <EditIcon className="icon-class dark:fill-[#f8f4eb]" />
          </button>
        </td>
        <td>
          <button className="icon">
            <DeleteIcon className="icon-class dark:fill-[#f8f4eb]" />
          </button>
        </td>
      </tr>
  );
}
