// import { useCallback } from 'react';
import React from 'react';
import { Handle, Position } from 'reactflow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TableNodeRow from './TableNodeRow';


// const handleStyleUp = { top: 10 };
// const handleStyleDown = { bottom: 10 };

function TableNode({ data }) {
  const rowData = Object.values(data.table[1]);

  // everytime we generate a table, we need to iterate through every edge and check if if the source of the edge matches the table id and if the target of the edge matches
  // the table id,
  const tableHandles = [];

  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === data.table[0]) {
      tableHandles.push(
        <Handle
          type="source"
          position={Position.Right}
          id={data.edges[i].sourceHandle}
          style={{ bottom: 12, top: 'auto' }} // kind of confused by these
        />
      );
    }
    if (data.edges[i].target === data.table[0]) {
      tableHandles.push(
        <Handle
          type="target"
          position={Position.Left}
          id={data.edges[i].targetHandle}
          style={{ bottom: 12, top: 'auto' }} // kind of confused by these
        />
      );
    }
  }

  // if (row.IsPrimaryKey) { 
  //   row.primaryHandle = (
  // <Handle
  //   type="source"
  //   position={Position.Right}
  //   id={`${row.field_name}-in-${row.TableName}`}
  //   style={{ bottom: 12, top: 'auto' }} // kind of confused by these
  // />
  //   );
  // }
  // if (row.IsForeignKey) {
  //   console.log(`foreign key is true, the primary key is ${row.References[0].PrimaryKeyName}
  //   and the primary key table is ${row.References[0].PrimaryKeyTableName}`);
  //   row.foreignHandle = (
  //     <Handle
  //       type="target"
  //       position={Position.Left}
  //       id={`${row.References[0].ReferencesPropertyName}-in-${row.References[0].ReferencesTableName}`}
  //       style={{ bottom: 12, top: 'auto' }} // kind of confused by these
  //     />
  //   );
  // }

  return (
    <div className="table-node">
      {tableHandles}
      <div>
        <label htmlFor="text">{data.table[0]}</label>
      </div>
      <div>
        <button className="add-field">+ FIELD</button>
      </div>
      <div>
        <table>
          <thead>
            <tr className="head-row">
              <th scope="col">Column</th>
              <th scope="col">Type</th>
              <th scope="col">Constraints</th>
              <th scope="col">PK</th>
              <th scope="col">FK</th>
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
              <TableNodeRow row={row} key={`row${index}`} />
            ))}
          </tbody>
        </table>
      </div>
      {/* <Handle
        type="source"
        position={Position.Right}
        id="output1"
        style={{ top: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output2"
        style={{ bottom: 10, top: 'auto' }}
      /> */}
    </div>
  );
}

export default TableNode;
