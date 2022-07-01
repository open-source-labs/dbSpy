import React, { useState } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Draggable from "react-draggable";

const columns: GridColDef[] = [
  { field: "col1", headerName: "Column", width: 100, editable: true },
  { field: "col2", headerName: "Type", width: 100, editable: true },
  { field: "col3", headerName: "Constraints", width: 100, editable: true },
  { field: "col4", headerName: "PK", width: 75, editable: true },
  { field: "col5", headerName: "FK", width: 50, editable: true },
  { field: "col6", headerName: "Ref", width: 100, editable: true },
];

interface TableProps {
  tableInfo: {
    Name: string;
    Properties: [
      {
        IsForeignKey: boolean;
        IsPrimaryKey: boolean;
        Name: string;
        References: Array<any>;
        TableName: string;
        Value: any;
        additional_constraints: string | null;
        data_type: string;
        field_name: string;
      }
    ];
  };
}

export default function Table({ tableInfo }: TableProps) {
  // const { Name, Properties } = tableInfo;

  // const [activeDrags, setActiveDrags] = useState(0);
  // const [deltaPosition, setDeltaPosition] = useState({
  //   x: 0,
  //   y: 0,
  // });
  // const [controlledPosition, setControlledPosition] = useState({
  //   x: -400,
  //   y: 200,
  // });

  // function onStart() {
  //   setActiveDrags(activeDrags + 1);
  // }

  // function onStop() {
  //   setActiveDrags(activeDrags - 1);
  // }

  // const dragHandler = { onStart, onStop };

  const rowArr: Array<any> = [];

  if (Object.keys(tableInfo).length) {
    tableInfo.Properties.forEach((obj, ind) => {
      rowArr.push({
        id: ind,
        col1: obj.field_name,
        col2: obj.data_type,
        col3: obj.additional_constraints,
        col4: obj.IsPrimaryKey,
        col5: obj.IsForeignKey,
        col6: obj.References,
      });
    });
  }

  // tableInfo.Properties.forEach((obj, ind) => {
  //   rowArr.push({
  //     id: ind,
  //     col1: obj.field_name,
  //     col2: obj.data_type,
  //     col3: obj.additional_constraints,
  //     col4: obj.IsPrimaryKey,
  //     col5: obj.IsForeignKey,
  //     col6: obj.References,
  //   });
  // });

  const rows: GridRowsProp = rowArr;

  // const {Name, Properties}: {Name: string; Properties: Array<any>} = tableInfo

  return (
    <div style={{ height: "100%", width: "100%", margin: "35px" }}>
      <Draggable bounds="parent">
        <div style={{ height: 300, width: 450, margin: "35px" }}>
          <div style={{ fontSize: "24px" }}>{tableInfo.Name}</div>
          <DataGrid
            rows={rows}
            columns={columns}
            style={{ backgroundColor: "white" }}
          />
        </div>
      </Draggable>
    </div>
  );
}
