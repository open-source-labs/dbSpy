import React, {
  Dispatch,
  DragEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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
  GridRow,
  GridCellEditCommitParams,
  GridCellValue,
  GridCellParams,
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
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
  setFetchedData: (fetchedData: any) => void;
  fetchedData: any;
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
  setFetchedData,
  fetchedData,
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
  // rowModesModel is current table state.
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [fkReference, setfkReference] = useState({});
  const [opens, setOpens] = useState(false);
  const [formDialogEditRow, setFormDialogEditRow] = useState({
    row: { column: "" },
  });
  const [formDialogEditCol, setFormDialogEditCol] = useState("");

  function logicCheck(newRow: GridRowModel, oldRow: GridRowModel[]): string {
    if (Object.values(newRow).includes("")) return "empty";

    for (let i = 0; i < oldRow.length; i++) {
      if (oldRow[i].column === newRow.column && oldRow[i].id !== newRow.id)
        return "columnIssue";
      if (
        oldRow[i].column === newRow.column &&
        oldRow[i].type === newRow.type &&
        oldRow[i].constraint === newRow.constraint &&
        oldRow[i].pk === newRow.pk &&
        oldRow[i].fk === newRow.fk &&
        oldRow[i].id === newRow.id
      ) {
        return "sameName";
      }
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

  // style= {{border: "black 1px solid", margin: "0"}}

  const handleEditClick = (id: GridRowId) => () => {
    const modes: any = Object.values(rowModesModel);
    if (modes.length > 0) {
      for (let i = 0; i < modes.length; i++) {
        console.log(modes);
        if (modes[i].mode === "edit") {
          setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
          });
          return;
        }
      }
    }
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit },
    });
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
    console.log("fkReference:");
    console.log(fkReference);

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
    } else if (logicCheck(newRow, rows) === "sameName") {
      alert("Please make changes before you save.");
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

    // console.log("ColBeforechange: ", ColBeforeChange);
    // console.log("ColeAfterChange: ", newRow);
    // console.log("tablename: ", tablename);
    //console.log(
    //  "tableBeforechange: ",
    //  DataStore.getData(DataStore.store.size - 1)
    //);
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
      DataStore.getData(DataStore.store.size - 1)
    );

    //fix this with specific error message provided from permissiveFn
    if (Object.keys(queryResult[0])[1] === "errorMsg") {
      const msg: any = queryResult[0];
      alert(msg.errorMsg);
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
      valueOptions: [" ", "NOT NULL", "UNIQUE"],
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
      valueParser: (value: string, row: GridRowModel) => {
        console.log("id:------->", id);
        setfkReference({});
        setFormDialogEditRow(row);
        if (value == "true") {
          console.log("row ----------->");
          console.log(row);
          setOpens(true);
        } else {
          setfkReference({
            PrimaryKeyTableName: " ",
            PrimaryKeyName: " ",
            ReferencesPropertyName: row.column,
            ReferencesTableName: tablename,
            isDestination: false,
            constrainName: "",
            type: "remove",
          });
        }
        return value;
      },
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
      ...DataStore.getData(DataStore.store.size - 1),
      ...dataAfterChange,
    });
    setFetchedData(DataStore.getData(DataStore.store.size - 1));
    // console.log("this is dataStore2:", DataStore.store);
    //console.log("this is data After Change: ", dataAfterChange);
  }

  // console.log("this is updated rows: ", rows);
  // console.log("this is the table I am editing: ", id);
  // for (let cols in tableInfo) {
  //   console.log(tableInfo[cols].References);
  // }
  // const {Name, Properties}: {Name: string; Properties: Array<any>} = tableInfo
  const updateXarrow = useXarrow();
  return (
    <Draggable
      // bounds={".mantine-AppShell-body"}
      onDrag={updateXarrow}
      onStop={updateXarrow}
    >
      <div
        id={id}
        style={{
          height: "auto",
          color: "white",
          width: "450px",
          margin: "20px",
          background: "#2b3a42",
          borderRadius: "5px",
          padding: "3px",
          fontFamily: "Arial",
          // marginTop: "35px",
          // marginBottom: "35px",
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
          </div> 
            //
          */}
        </div>
        <FormDialog
          opens={opens}
          setOpens={setOpens}
          setRows={setRows}
          setRowModesModel={setRowModesModel}
          formDialogEditRow={formDialogEditRow}
          formDialogEditCol={formDialogEditCol}
          setFormDialogEditCol={setFormDialogEditCol}
          setFormDialogEditRow={setFormDialogEditRow}
          rows={rows}
          fetchedData={fetchedData}
          fkReference={fkReference}
          tablename={tablename}
          setfkReference={setfkReference}
        />
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
          /*
          onStateChange={(state:any) => {
          //  console.log('on state running');
          //  console.log('fk button state: ', state);
            if (state.editRows)
            {
              
            for (let cols in state.editRows)
            {
            //console.log('editrow col', state.editRows[cols].fk.value)
           // console.log('tableinfo row', tableInfo[cols].IsForeignKey )
          
              let focus = null; 

              if (state.focus)
               if (state.focus.cell)
                 if (state.focus.cell.field)
                    focus = state.focus.cell.field; 


                    let currentRow = null; 
                    for (let i = 0; i < rows.length; i++){
                      if (rows[i].column == cols)
                      {
                        currentRow = rows[i]
                        
                      }
                
                    }
          

          
          
          }}} */

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
        // color="primary"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleClick}
        style={{
          position: "absolute",
          right: "3px",
          margin: 0,
          color: "black",
        }}
      >
        Field
      </Button>
    </GridToolbarContainer>
  );
}

interface FormDialogProps {
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;

  //setRows is used to update the table model, to revert changes upon cancel button hit
  setRows: React.Dispatch<React.SetStateAction<any[]>>;

  //opens is boolean to toggle the modal open or closed
  opens: boolean;

  //setOpens used to set state for opens, which is used to open or close the box
  setOpens: Dispatch<SetStateAction<boolean>>;

  //formDialogEditRow is used to assign & edit the row object to FormDialog to/from parent object
  formDialogEditRow: any;

  //formDialogEditCol is used to assign Column Name of what is being edited by user
  formDialogEditCol: string;

  //used to set or reset the column edit assignment
  setFormDialogEditCol: React.Dispatch<React.SetStateAction<string>>;

  //used to set or reset the row edit assignment
  setFormDialogEditRow: React.Dispatch<React.SetStateAction<any>>;

  rows: any[];

  fetchedData: any;

  fkReference: {};

  tablename: string;

  setfkReference: React.Dispatch<React.SetStateAction<any>>;
}

function FormDialog({
  setRowModesModel,
  setRows,
  opens,
  setOpens,
  setFormDialogEditRow,
  setFormDialogEditCol,
  formDialogEditCol,
  formDialogEditRow,
  rows,
  fetchedData,
  fkReference,
  tablename,
  setfkReference,
}: FormDialogProps) {
  let temp: (JSX.Element | undefined)[] = [];
  let references = { column_name: "", references: {} };
  const [columnList, setcolumnList] = useState<
    (JSX.Element | null | undefined)[]
  >([]);
  const [pkList, setpkList] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedCol, setselectedCol] = useState("");
  const handleClose = () => {
    setFormDialogEditCol("false");
    console.log("formDialogEdit in handleClose", formDialogEditCol);
    setOpens(false);
  };

  const handleSubmit = () => {
    // Add state to prevent button
    setFormDialogEditCol("true");
    let PrimaryKeyTableName = fetchedData[pkList][selectedCol].Name;
    let PrimaryKeyName =
      selectedCol + " " + fetchedData[pkList][selectedCol].data_type;
    let ReferencesPropertyName =
      formDialogEditRow.row.column + " " + formDialogEditRow.row.type;
    let ReferencesTableName: string | null = tablename;
    let isDestination = false;
    let constrainName =
      ReferencesTableName + "_" + ReferencesPropertyName + "_" + "fkey";
    let obj = {};
    if (PrimaryKeyTableName == null) alert("Must Select Primary Table Name");
    else if (PrimaryKeyName == null) alert("Must Select Primary Key Column");
    else if (ReferencesPropertyName == null)
      alert("Error: Reference Property Name Not Set");
    else if (ReferencesTableName == null)
      alert("Error: References Table Not Set");
    else {
      setfkReference({
        PrimaryKeyTableName: PrimaryKeyTableName,
        PrimaryKeyName: PrimaryKeyName,
        ReferencesPropertyName: ReferencesPropertyName,
        ReferencesTableName: ReferencesTableName,
        isDestination: false,
        constrainName: constrainName,
        type: "add",
      });

      setOpens(false);
    }

    /*
IsDestination: false
PrimaryKeyName: "id integer NOT NULL"
PrimaryKeyTableName: "public.user_accounts"
ReferencesPropertyName: "user_id integer"
ReferencesTableName: "public.profile"
constrainName: "profile_user_id_fkey
*/

    console.log("formDialogEdit Submit Complete", formDialogEditCol);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setpkList(event.target.value);
    console.log("Row in Edit in formDialogEdit ---->");
    console.log(formDialogEditRow.row);
    let temp = Object.keys(fetchedData[event.target.value]).map(
      (key, index) => {
        if (fetchedData[event.target.value][key].IsPrimaryKey == true)
          return (
            <MenuItem key={index} value={key}>
              {key}
            </MenuItem>
          );
      }
    );

    setcolumnList(temp);
    console.log(columnList);
  };

  const handleColChange = (event: SelectChangeEvent) => {
    setselectedCol(event.target.value);
  };

  let listOfTables = Object.keys(fetchedData).map((key, index) => {
    if (key !== tablename)
      return (
        <MenuItem key={index} value={key}>
          {key}
        </MenuItem>
      );
  });
  //formDialogEditRow.row.column
  return (
    <div>
      <Dialog
        open={opens}
        onClose={handleClose}
        PaperProps={{
          style: {
            //backgroundColor: 'grey', Add color styling here...
            boxShadow: "ffff",
          },
        }}
        sx={{
          display: "inline",
          fontWeight: "bold",
          width: "auto",
          mx: 0.5,
          fontSize: 14,
        }}
      >
        <DialogTitle>FOREIGN KEY FORM</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <br />
          </DialogContentText>
          <TextField
            id="fkTableName"
            label="FK Table Name"
            variant="outlined"
            defaultValue={tablename}
            contentEditable={false}
            inputProps={{ readOnly: true }}
          />
          <TextField
            id="fkColumnName"
            label="FK Column Name"
            variant="outlined"
            defaultValue={
              formDialogEditRow == undefined ? "" : formDialogEditRow.row.column
            }
            contentEditable={false}
            inputProps={{ readOnly: true }}
          />
          <span>
            <InputLabel id="demo-simple-select-label">
              Select Primary Key Table
            </InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={pkList}
              label="Primary Key"
              onChange={handleChange}
            >
              {listOfTables}
            </Select>

            <InputLabel id="demo-simple-select-label">
              Select Primary Column Table
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCol}
              label="Primary Key"
              onChange={handleColChange}
            >
              {columnList}
            </Select>
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
