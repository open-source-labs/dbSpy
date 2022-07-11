import React, { DragEvent, useEffect, useState } from "react";
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
  useDemoData,
} from "@mui/x-data-grid-generator";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { Modal, Text } from "@mantine/core";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import DataStore from "../../Store";
import permissiveColumnCheck from "../../permissiveFn.js";

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
  setNumEdit: (numEdit: number) => void;
  numEdit: number;
  setFetchedData: (fetchedData: any) => void;
}

interface RowProps {
  id: string;
  column: string;
  constraint: string;
  fk: boolean;
  pk: boolean;
  type: string;
  reference: {}[];
}

export default function Table({
  tableInfo,
  id,
  setNumEdit,
  numEdit,
  setFetchedData,
}: TableProps) {
  // console.log("this is tableinfo from table: ", tableInfo);
  // const { Name, Properties } = tableInfo;

  // const [activeDrags, setActiveDrags] = useState(0);
  const [deltaPosition, setDeltaPosition] = useState({
    x: 0,
    y: 0,
  });

  function handleDrag(e: DragEvent<HTMLDivElement>, ui: any) {
    const { x, y } = deltaPosition;
    setDeltaPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
    // console.log(deltaPosition);
  }

  const tablename = id;
  let rowArr: Array<any> = [];

  useEffect(() => {
    let rowArr2: Array<any> = [];
    if (Object.keys(tableInfo).length) {
      Object.values(tableInfo).forEach((obj, ind) => {
        rowArr2.push({
          id: obj.field_name,
          column: obj.field_name,
          type: obj.data_type,
          constraint: obj.additional_constraints,
          pk: obj.IsPrimaryKey,
          fk: obj.IsForeignKey,
          reference: obj.References,
        });
      });
    }
    setRows(rowArr2);
  }, [tableInfo]);

  if (Object.keys(tableInfo).length) {
    Object.values(tableInfo).forEach((obj, ind) => {
      rowArr.push({
        id: obj.field_name,
        column: obj.field_name,
        type: obj.data_type,
        constraint: obj.additional_constraints,
        pk: obj.IsPrimaryKey,
        fk: obj.IsForeignKey,
        reference: obj.References,
      });
    });
  }

  // let rows: GridRowsProp = rowArr;
  const [rows, setRows] = useState(rowArr);
  // console.log(rows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  function logicCheck(newRow: GridRowModel, oldRow: GridRowModel[]): string {
    if (Object.values(newRow).includes("")) return "empty";

    for (let i = 0; i < oldRow.length; i++) {
      if (oldRow[i].column === newRow.column && oldRow[i].id !== newRow.id)
        return "columnIssue";
      if (oldRow[i].pk === true && newRow.pk === "true") return "pkIssue";
    }

    if (newRow.fk === "true") return "assignRef";

    return "";
  }

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

  const currentRowEditting = "";
  const handleSaveClick =
    (id: GridRowId, getValue: (id: GridRowId, field: string) => any) => () => {
      // console.log("this is rows: ", rows);
      // console.log("this is rowModesModel", rowModesModel);
      // console.log("this is getValue", getValue(id, "column"));
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      // console.log("this is getValue", getValue(id, "column"));
    };

  const handleDeleteClick = (id: GridRowId) => () => {
    updatedRowsToTable(rows.filter((row) => row.id !== id));
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
    if (logicCheck(newRow, rows) === "empty") {
      alert("Please make sure to fill out every cell!");
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    } else if (logicCheck(newRow, rows) === "columnIssue") {
      alert("you cannot have duplicate column names!");
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    } else if (logicCheck(newRow, rows) === "pkIssue") {
      alert("you cannot have more than one PK!");
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    }

    // else if (logicCheck(newRow, rows) === "assignRef") {
    //   setRefOpened(true);
    // }
    // console.log("permissiveColumnCheck runnning");
    //iterate through the beforeChange table.
    let ColBeforeChange;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === newRow.id) {
        ColBeforeChange = rows[i];
      }
    }

    console.log("ColBeforechange: ", ColBeforeChange);
    console.log("ColeAfterChange: ", newRow);
    console.log("tablename: ", tablename);
    console.log(
      "tableBeforechange: ",
      DataStore.store.get(DataStore.store.size - 1)
    );
    // console.log(
    //   "this is Query",
    //   permissiveColumnCheck(
    //     ColBeforeChange,
    //     newRow,
    //     tablename,
    //     DataStore.store.get(DataStore.store.size - 1)
    //   )
    // );

    const queryResult = permissiveColumnCheck(
      ColBeforeChange,
      newRow,
      tablename,
      DataStore.store.get(DataStore.store.size - 1)
    );

    if (Object.keys(queryResult[0])[0] === "status") {
      alert("you cannot use reserved keyword for a column name!");
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    }

    DataStore.queryList.push(...queryResult);
    DataStore.setQuery(DataStore.queryList.slice());
    console.log("this is stored Queries", DataStore.queries);

    const updatedRow = { ...newRow, isNew: false };
    // console.log("this is currentRow", rows);
    // console.log("this is updatedRow:", updatedRow);
    updatedRowsToTable(
      rows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    //console.log("this is updatedRow:", updatedRow);
    setNumEdit(numEdit + 1);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns: GridColumns = [
    {
      field: "column",
      headerName: "Column",
      width: 75,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        "binary",
        "blob",
        "boolean",
        "date",
        "datetime",
        "decimal",
        "float",
        "integer",
        "serial",
        "string",
        "text",
        "time",
        "timestamp",
        "varchar(255)",
      ],
    },
    {
      field: "constraint",
      headerName: "Constraints",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: ["NOT NULL", "UNIQUE"],
    },
    {
      field: "pk",
      headerName: "PK",
      width: 50,
      editable: true,
      type: "singleSelect",
      valueOptions: ["true", "false"],
    },
    {
      field: "fk",
      headerName: "FK",
      width: 50,
      editable: true,
      type: "singleSelect",
      valueOptions: ["true", "false"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 70,
      cellClassName: "actions",
      getActions: ({ id, getValue }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id, getValue)}
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

  function updatedRowsToTable(rows: RowProps[]) {
    const dataAfterChange: any = {};
    const col: any = {};
    rows.forEach((obj: RowProps) => {
      const { id, column, constraint, fk, pk, type, reference } = obj;
      col[column] = {
        IsForeignKey: fk,
        IsPrimaryKey: pk,
        References: reference,
        TableName: tablename,
        additional_constraints: constraint,
        data_type: type,
        field_name: column,
      };
      dataAfterChange[tablename] = col;
    });

    DataStore.setData({
      ...DataStore.store.get(DataStore.store.size - 1),
      ...dataAfterChange,
    });
    setFetchedData(DataStore.store.get(DataStore.store.size - 1));
    console.log("this is dataStore2:", DataStore.store);
    console.log("this is data After Change: ", dataAfterChange);
  }

  // console.log("this is updated rows: ", rows);
  // console.log("this is the table I am editing: ", id);
  // for (let cols in tableInfo) {
  //   console.log(tableInfo[cols].References);
  // }
  // const {Name, Properties}: {Name: string; Properties: Array<any>} = tableInfo
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div
        id={id}
        style={{
          height: "auto",
          width: "450px",
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
          {/* <div onDrag={handleDrag}>
            x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}
          </div> */}
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
          onProcessRowUpdateError={(error) => console.log("logic failed")}
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
    //console.log(id);
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
