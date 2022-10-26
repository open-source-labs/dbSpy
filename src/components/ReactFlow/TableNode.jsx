import { React, useState , useEffect} from 'react';
import { Handle, Position } from 'reactflow';
import TableNodeRow from './TableNodeRow';
import useSchemaStore from '../../store/schemaStore'

function TableNode({ data }) {
  // console.log('table data: ', data.table);
  // console.log('table data[0]: ', data.table[0]);
  // console.log('table data[1]: ', data.table[1]);
  // console.log('initialEdges: ', data.edges);
  const {schemaStore, setSchemaStore} = useSchemaStore(state=>state);
  const tableData = data.table[1];
  const rowData = Object.values(data.table[1]);
  //console.log('rowData', rowData);
  const [tableRows, setTableRows] = useState(rowData);
  // everytime we generate a table, we need to iterate through every edge and check if if the source of the edge matches the table id and if the target of the edge matches
  // the table id,
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    // console.log('yupper', data.edges[i].sourceHandle);
    if (data.edges[i].source === data.table[0]) {
      const sourceHandlePos = data.edges[i].sourceHandle;
      tableHandles.push(
        <Handle
          // key={`${data.table[0]}-${data.edges[i].sourceHandle}-source`}
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
          // key={`${data.table[0]}-${data.edges[i].targetHandle}-target`}
          type="target"
          position={Position.Left}
          id={data.edges[i].targetHandle}
          style={{ bottom: 'auto', top: '115' }} // kind of confused by these 146
        />
      );
    }
  }
  const addRow = () => {
    const currentSchema = { ...schemaStore };
    currentSchema[data.table[0]].newRow = {
      Name: '',
      Value: '',
      TableName: data.table[0],
      References: [
        {
          PrimaryKeyName: '',
          ReferencesPrimaryName: '',
          PrimaryKeyTableName: '',
          ReferencesTableName: '',
          IsDestination: '',
          constrainName: '',
        },
      ],
      IsPrimaryKey: '',
      IsForeignKey: '',
      field_name: 'newRow',
      data_type: '',
      additional_constraints: '',
    };
    setSchemaStore(currentSchema);
    console.log('NEW SCHEMA: ', currentSchema);
  };

  return (
    <div className="table-node transition-colors duration-500">
      {tableHandles}
      <div>
        <label htmlFor="text" className="bg-[#075985] dark:opacity-75">
          {data.table[0]}
        </label>
      </div>
      <div>
        <button
          className="add-field transition-colors duration-500 dark:text-[#fbf3de]"
          onClick={addRow}
        >
          + FIELD
        </button>
      </div>
      <div className="table-bg transition-colors duration-500 dark:bg-slate-700">
        <table className="transition-colors duration-500 dark:text-[#fbf3de]">
          <thead>
            <tr className="head-row">
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                Column
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                Type
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                Constraints
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                PK
              </th>
              <th
                scope="col"
                className="transition-colors duration-500 dark:text-[#fbf3de]"
              >
                FK
              </th>
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
              <TableNodeRow
                row={row}
                key={`${data.table[0]}-row${index}`}
                id={`${data.table[0]}-row${index}`}
                tableData={tableData}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableNode;
