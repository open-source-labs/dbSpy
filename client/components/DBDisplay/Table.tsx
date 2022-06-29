import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "col1", headerName: "Column Name", width: 150 },
  { field: "col2", headerName: "Primary Key", width: 150 },
  { field: "col3", headerName: "Foreign Key", width: 150 },
  { field: "col4", headerName: "References", width: 150 },
];

const rows: GridRowsProp = [
  { id: 1, col1: "username", col2: true, col3: false, col4: "none" },
  { id: 2, col1: "phone number", col2: false, col3: false, col4: "none" },
  { id: 3, col1: "email", col2: false, col3: false, col4: "none" },
];

export default function Table() {
  return (
    <div style={{ height: 300, width: "50%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
