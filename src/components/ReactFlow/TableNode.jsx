// import { useCallback } from 'react';
import React from 'react';
import { Handle, Position } from 'reactflow';
import TableNodeRow from './TableNodeRow';

// const handleStyleUp = { top: 10 };
// const handleStyleDown = { bottom: 10 };

function TableNode({ data }) {
  console.log('table data: ', data.table);
  console.log('table name: ', data.table[0]);
  console.log('rows: ', Object.values(data.table[1]));
  console.log('initialEdges: ', data.edges);
  console.log('test: ', data.edges[0].sourceHandle);
  const tableData = data.table[1];
  const rowData = Object.values(data.table[1]);

  // everytime we generate a table, we need to iterate through every edge and check if if the source of the edge matches the table id and if the target of the edge matches
  // the table id,
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    // console.log('yupper', data.edges[i].sourceHandle);
    if (data.edges[i].source === data.table[0]) {
      const sourceHandlePos = data.edges[i].sourceHandle;
      tableHandles.push(
        <Handle
          type="source"
          position={Position.Right}
          id={data.edges[i].sourceHandle}
          style={{ sourceHandlePos }} // kind of confused by these
        />
      );
    }
    if (data.edges[i].target === data.table[0]) {
      tableHandles.push(
        <Handle
          type="target"
          position={Position.Left}
          id={data.edges[i].targetHandle}
          style={{ bottom: 'auto', top: '115' }} // kind of confused by these 146
        />
      );
    }
  }
  const addRow = () => console.log('youAddedRow')

  return (
    <div className="table-node transition-colors duration-500">
      {tableHandles}
      <div>
        <label htmlFor="text" className='bg-[#075985] dark:opacity-75'>{data.table[0]}</label>
      </div>
      <div>
        <button className="add-field dark:text-[#fbf3de] transition-colors duration-500" onClick={addRow}>+ FIELD</button>
      </div>
      <div className='table-bg dark:bg-slate-700 transition-colors duration-500'>
        <table className='dark:text-[#fbf3de] transition-colors duration-500'>
          <thead>
            <tr className="head-row">
              <th scope="col" className='dark:text-[#fbf3de] transition-colors duration-500'>Column</th>
              <th scope="col" className='dark:text-[#fbf3de] transition-colors duration-500'>Type</th>
              <th scope="col" className='dark:text-[#fbf3de] transition-colors duration-500'>Constraints</th>
              <th scope="col" className='dark:text-[#fbf3de] transition-colors duration-500'>PK</th>
              <th scope="col" className='dark:text-[#fbf3de] transition-colors duration-500'>FK</th>
            </tr>
          </thead>
          <tbody>
            <tr className="empty-row">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {rowData.map((row, index) => (
              <TableNodeRow row={row} key={`row${index}`} tableData={tableData}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableNode;
