import React, { useState } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridColumns,
  GridRowModesModel,
  GridToolbarContainer,
  GridRowModes,
  GridActionsCellItem,
  GridRowParams,
  MuiEvent,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
  randomId,
} from "@mui/x-data-grid-generator";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { Text } from "@mantine/core";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

interface TableProps {
  tableInfo: {
    [key: string]: {
      IsForeignKey: boolean;
      IsPrimaryKey: boolean;
      Name: string;
      References: Array<any>;
      TableName: string;
      Value: any;
      additional_constraints: string | null;
      data_type: string;
      field_name: string;
    };
  };
  id: string;
}

export default function Table({ tableInfo, id }: TableProps) {
  // console.log("this is tableinfo from table: ", tableInfo);
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

  let rowArr: Array<any> = [];

  if (Object.keys(tableInfo).length) {
    Object.values(tableInfo).forEach((obj, ind) => {
      rowArr.push({
        id: obj.field_name,
        column: obj.field_name,
        type: obj.data_type,
        constraint: obj.additional_constraints,
        pk: obj.IsPrimaryKey,
        fk: obj.IsForeignKey,
        // col6: obj.References,
      });
    });
  }

  // let rows: GridRowsProp = rowArr;
  const [rows, setRows] = useState(rowArr);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    // console.log("this is rows: ", rows);
    // console.log("this is rowModesModel", rowModesModel);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    console.log("this is updatedRow:", updatedRow);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns: GridColumns = [
    { field: "column", headerName: "Column", width: 75, editable: true },
    { field: "type", headerName: "Type", width: 100, editable: true },
    {
      field: "constraint",
      headerName: "Constraints",
      width: 100,
      editable: true,
    },
    { field: "pk", headerName: "PK", width: 50, editable: true },
    { field: "fk", headerName: "FK", width: 50, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 75,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    // { field: "col6", headerName: "Ref", width: 50, editable: true },
  ];

  console.log("this is updated rows: ", rows);

  // const {Name, Properties}: {Name: string; Properties: Array<any>} = tableInfo
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div
        id={id}
        style={{
          height: "auto",
          width: "450",
          marginTop: "35px",
          marginBottom: "35px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "24px" }}>{id}</div>
          {/* <Button
            variant="outline"
            sx={{
              fontSize: "16px",
              border: "0px solid",
              color: "black",
              backgroundColor: "transparent",
            }}
          >
            + add row
          </Button> */}
        </div>
        <DataGrid
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[10]}
          rowHeight={30}
          autoHeight={true}
          editMode={"row"}
          hideFooter={true}
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableColumnSelector={true}
          getRowId={(r) => r.id}
          rowModesModel={rowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{ bgcolor: "white", fontSize: "12px" }}
        />
      </div>
    </Draggable>
  );
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    console.log(id);
    setRows((oldRows) => [
      ...oldRows,
      { id, column: "", type: "", constraint: "", pk: "", fk: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "column" },
    }));
  };

  return (
    <GridToolbarContainer style={{ height: "30px" }}>
      <Button
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleClick}
        style={{ position: "absolute", right: "3px", margin: 0 }}
      >
        Add row
      </Button>
    </GridToolbarContainer>
  );
}
