import React, {
  Dispatch,
  DragEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

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
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
  randomId,
  useDemoData,
} from '@mui/x-data-grid-generator';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';
import { Modal, Text } from '@mantine/core';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import DataStore from '../../Store';
import permissiveColumnCheck, {
  permissiveColumnDropCheck,
} from '../../permissiveFn.js';
import mySqlPermissiveColumnCheck, { mySqlPermissiveColumnDropCheck } from '../../mySqlPermissiveFn.js';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getModeForFileReference } from 'typescript';

type Props = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

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
  tableId?: any;
  setId?: any;
  id: string;
  setFetchedData: (fetchedData: any) => void;
  setSqlOpen: (sqlOpen: boolean) => void;
  fetchedData: any;
  sqlOpen: boolean;
  
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
  tableId,
  setId,
  id,
  setFetchedData,
  setSqlOpen,
  sqlOpen,
  fetchedData,
}: TableProps) {
  const tablename = id;

  /** useEffect is to update tables with the latest data after changes in tables upon browser reload */
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

  /** rowArr models the rows of the table for MUI X-DATA-GRID */
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
        reference: obj.References,
      });
    });
  }

  const [rows, setRows] = useState(rowArr);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [fkReference, setfkReference] = useState({
    PrimaryKeyTableName: '',
    PrimaryKeyName: '',
    ReferencesPropertyName: '',
    ReferencesTableName: '',
    isDestination: false,
    constrainName: '',
    type: '',
  });
  const [opens, setOpens] = useState(false);
  const [formDialogEditRow, setFormDialogEditRow] = useState({
    row: { column: '', type: '' },
  });
  const [formDialogEditCol, setFormDialogEditCol] = useState('');

  /* "logicCheck" - a function that checks the logic for column addition and edit. 
    "empty" = when all the cells are not filled
    "existingColName" = if there's an existing column already with the same name
    "saveWithoutChange" = if user tries to save without any changes - implemented to prevent generation of queries when nothing changed.
    "pkIssue" = if there's a duplicate primary key
  */
  function logicCheck(newRow: GridRowModel, oldRow: GridRowModel[]): string {
    if (Object.values(newRow).includes('')) return 'empty';
    if (oldRow.length === 1 && newRow.pk === 'false') return 'pkFirst';
    if (oldRow.length === 1 && newRow.constraint !== 'PRIMARY KEY' ) return 'pkFirstConstraint';
  

    for (let i = 0; i < oldRow.length; i++) {
      if (oldRow[i].column === newRow.column && oldRow[i].id !== newRow.id)
        return 'existingColName';
      if (
        oldRow[i].column === newRow.column &&
        oldRow[i].type === newRow.type &&
        oldRow[i].constraint === newRow.constraint &&
        oldRow[i].pk === newRow.pk &&
        oldRow[i].fk === newRow.fk &&
        oldRow[i].id === newRow.id
      ) {
        return 'saveWithoutChange';
      }
      if (oldRow[i].pk === true && newRow.pk === 'true') return 'pkIssue';
      if (oldRow[i].constraint === 'PRIMARY KEY' && newRow.constraint === 'PRIMARY KEY') return 'pkConstraintIssue'
    }

    if (newRow.fk === 'true') {
      if (fkReference.type == 'add') {
        //assign the fkreference to the new row
        newRow.references = fkReference;
      } else return 'assignRef';
    } else if (fkReference.type == 'remove' && newRow.isNew == false) {
      newRow.references = fkReference;
    } else {
      newRow.references = { type: '' };
    }

    return '';
  }

  // function updatedRowsToTable(rows: RowProps[]) {
  //   const dataAfterChange: any = {};
  //   const col: any = {};
  //   rows.forEach((obj: RowProps) => {
  //     const { id, column, constraint, fk, pk, type, reference } = obj;
  //     col[column] = {
  //       IsForeignKey: fk,
  //       IsPrimaryKey: pk,
  //       References: reference,
  //       TableName: tablename,
  //       additional_constraints: constraint,
  //       data_type: type,
  //       field_name: column,
  //     };
  //     dataAfterChange[tablename] = col;
  //   });

  //   DataStore.setData({
  //     ...DataStore.getData(DataStore.store.size - 1),
  //     ...dataAfterChange,
  //   });
  //   setFetchedData(DataStore.getData(DataStore.store.size - 1));
  // }

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  /* "handleEditClick" - a function that is triggered when Edit button is clicked. 
    Implemented a restriction when the user tries to edit multiple rows at the same time to prevent issues in query generation.
  */
  const handleEditClick = (id: GridRowId) => () => {
    const modes: any = Object.values(rowModesModel);
    if (modes.length > 0) {
      for (let i = 0; i < modes.length; i++) {
        if (modes[i].mode === 'edit') {
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

  /* "handleSaveClick" - a function that is triggered when Save button is clicked. 
    Changing the rowModes to View mode.
  */
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  /* "handleDeleteClick" - a function that is triggered when Delete (Trash Bin) button is clicked. 
    Implemented a restriction when the user tries to drop a column that is primary key or foreign key. Also protects unexpected deletion of data.
  */
  const handleDeleteClick = (id: GridRowId) => () => {
    let ColToDrop = rows.filter((row) => row.id === id);
    const dropQuery = permissiveColumnDropCheck(ColToDrop[0], tablename);
    let isDelete;
    if (dropQuery.length === 1) {
      if (dropQuery[0].status === 'failed') {
        alert(dropQuery[0].errorMsg);
        return;
      }
      isDelete = confirm(
        `Do you want to proceed with dropping "${ColToDrop[0].column}"?\nThe data stored under "${ColToDrop[0].column}" will be deleted.`
      );
    } else if (dropQuery.length === 2) {
      let warning = dropQuery[1].errorMsg;
      isDelete = confirm(
        `WARNING: ${warning}\n\nDo you want to proceed with dropping "\n${ColToDrop[0].column}"?`
      );
    }
    if (isDelete) {
      DataStore.queryList.push(dropQuery[0]);
      DataStore.setQuery(DataStore.queryList.slice());
      updatedRowsToTable(
        rows.filter((row) => row.id !== id),
        null
      );
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  /* "handleCancelClick" - a function that is triggered when Cancel button is clicked.
   */
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

  /* "processRowUpdate" - a function that gets triggered to update the "rows" when row is being processed after hitting save button.
  */
 const processRowUpdate = (newRow: GridRowModel) => {
   console.log('fkReference:');
   console.log(fkReference);
   console.log("pkFirst", newRow.constraint !== "Primary Key", newRow.pk !== 'true', rows)
   
   // check the logic first, if error, go back to Edit mode.X
   if (logicCheck(newRow, rows) === 'empty') {
     alert('Please make sure to fill out every cell!');
     setRowModesModel({
       ...rowModesModel,
       [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    } else if (logicCheck(newRow, rows) === 'existingColName') {
      alert('you cannot have duplicate column names!');
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    } else if (logicCheck(newRow, rows) === 'saveWithoutChange') {
      alert('Please make changes before you save.');
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    } 
    // else if (logicCheck(newRow, rows) === 'pkIssue') {
    //   alert('you cannot have more than one PK!');
    //   setRowModesModel({
    //     ...rowModesModel,
    //     [newRow.id]: { mode: GridRowModes.Edit },
    //   });
    //   return;
    // } 
    else if (logicCheck(newRow, rows) === 'pkFirst') {
      alert('Set your Primary Key first!');
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    }
    else if (logicCheck(newRow, rows) === 'pkFirstConstraint') {
      alert('Please select PRIMARY KEY in Constraints if pk is true!');
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    }
    else if (logicCheck(newRow, rows) === 'pkConstraintIssue') {
      alert('you cannot have more than PRIMARY KEY in Constraints!');
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      return;
    }
  


    // if (oldRow[i].constraint === 'PRIMARY KEY' && newRow.constraint === 'PRIMARY KEY') return 'pkConstraintIssue'
    // if (oldRow.length === 1 && newRow.constraint !== 'PRIMARY KEY' ) return 'pkFirstConstraint';
    // if (oldRow.length === 1 && newRow.pk === 'false') return 'pkFirst';
    // if (oldRow[0].pk === true && oldRow[0].constraint === 'PRIMARY KEY') return 'pkIssue';

    // Iterate through the beforeChange table to grab the column that is being edited before the change.
    let ColBeforeChange;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === newRow.id) {
        ColBeforeChange = rows[i];
      }
    }

    // permissiveColumnCheck in permissiveFn.js file. Returns the query for the change.
    const queryResult = permissiveColumnCheck(
      ColBeforeChange,
      newRow,
      tablename,
      DataStore.getData(DataStore.store.size - 1)
    );

      // mySqlpermissiveColumnCheck in mysql/permissiveFn.js file. Returns the query for the MySQL change.
      const mySqlQueryResult = mySqlPermissiveColumnCheck(
        ColBeforeChange,
        newRow,
        tablename,
        DataStore.getData(DataStore.store.size - 1)
      ); 

    // Another logic check with permissiveFn. Alerts specific error message provided from permissiveFn and revert back to Edit mode.
    if (Object.keys(queryResult[0])[1] === 'errorMsg') {
      const msg: any = queryResult[0];
      alert(msg.errorMsg);
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });

      return;
    }

    // Another logic check with mySQLpermissiveFn. Alerts specific error message provided from mySQLpermissiveFn and revert back to Edit mode.
    if (Object.keys(mySqlQueryResult[0])[1] === "errorMsg") {
      const msg: any = mySqlQueryResult[0];
      alert(msg.errorMsg);
      setRowModesModel({
        ...rowModesModel,
       [newRow.id]: { mode: GridRowModes.Edit },
      });
   
      return;
    }

    // Update DataStore with the queries just generated.
    if (sqlOpen === true){
      DataStore.queryList.push(...queryResult);
    }else {
      DataStore.queryList.push(...mySqlQueryResult)
    }
    console.log('this is SQLOpen', DataStore.queryList);
    DataStore.setQuery(DataStore.queryList.slice());
    //console.log("this is stored Queries", DataStore.queries);
    let copyRef = null;
    if (newRow.references.type == 'add') {
      newRow.fk = true;
      copyRef = {
        PrimaryKeyTableName: newRow.references.PrimaryKeyTableName,
        PrimaryKeyName: newRow.references.PrimaryKeyName,
        ReferencesPropertyName: newRow.column,
        ReferencesTableName: newRow.references.ReferencesTableName,
        IsDestination: newRow.references.IsDestination,
        constrainName:
          newRow.references.PrimaryKeyTableName +  
          '_' +
          newRow.column +
          '_' +
          'fkey',
      };

      newRow.reference.push(copyRef);
    }
    if (fkReference.type == 'remove') {
      let arrayCopy = [];

      for (let i = 0; i < newRow.reference.length; i++) {
        // remove IsDestinations set to false....
        if (newRow.reference[i].IsDestination == true) {
          arrayCopy.push(newRow.reference[i]);
        }
      }
      newRow.fk = false;
      newRow.reference = arrayCopy;
    }
    delete newRow.references;
    const updatedRow = { ...newRow, isNew: false };

    updatedRowsToTable(
      rows.map((row) => (row.id === newRow.id ? updatedRow : row)),
      updatedRow
    );
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const columns: GridColumns = [
    {
      field: 'column',
      headerName: 'Column',
      width: 75,
      editable: true,

      valueParser: (value: string, row: GridRowModel) => {
        //console.log('id:------->', id);
        //setfkReference({PrimaryKeyTableName: ' ', 'PrimaryKeyName' :' ',

        let copy = formDialogEditRow;
        copy.row.column = value;
        setFormDialogEditRow(copy);
        return value;
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        'binary',
        'blob',
        'boolean',
        'date',
        'datetime',
        'decimal',
        'float',
        'integer',
        'serial',
        'string',
        'text',
        'time',
        'timestamp',
        'varchar(255)',
      ],
      valueParser: (value: string, row: GridRowModel) => {
        //console.log('id:------->', id);
        //setfkReference({PrimaryKeyTableName: ' ', 'PrimaryKeyName' :' ',

        let copy = formDialogEditRow;
        copy.row.type = value;

        setFormDialogEditRow(copy);
        return value;
      },
    },
    {
      field: 'constraint',
      headerName: 'Constraints',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['NA', 'NOT NULL', 'UNIQUE', 'PRIMARY KEY'],
    },
    {
      field: 'pk',
      headerName: 'PK',
      width: 50,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['true', 'false'],
    },
    {
      field: 'fk',
      headerName: 'FK',
      width: 50,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['true', 'false'],
      valueParser: (value: string, row: GridRowModel) => {
        let setCol = '';
        if (formDialogEditCol !== '') setCol = formDialogEditCol;
        else setCol = row.column;

        setfkReference({
          PrimaryKeyTableName: ' ',
          PrimaryKeyName: ' ',
          ReferencesPropertyName: setCol,
          ReferencesTableName: tablename,
          isDestination: false,
          constrainName: '',
          type: '',
        });
        //setFormDialogEditRow(row);
        if (value == 'true') {
          setOpens(true);
        } else {
          let ref = [];
          for (let i = 0; i < row.row.reference.length; i++) {
            if (row.row.reference[i].IsDestination == false) {
              ref = row.row.reference[i];
            }
          }
          ref.type = 'remove';
          setfkReference(ref);
        }
        return value;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 70,
      cellClassName: 'actions',
      getActions: ({ id, getValue }) => {
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
              // color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            // color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            // color="inherit"
          />,
        ];
      },
    },

    // { field: "col6", headerName: "Ref", width: 50, editable: true },
  ];

  function updatedRowsToTable(rows: RowProps[], updatedRow: RowProps | null) {
    const dataAfterChange: any = {};
    const col: any = {};
    rows.forEach((obj: RowProps) => {
      console.log('THIS IS EACH OBJECT', obj.id)
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

    let newPKTable = null;
    let  Tables:any
    
    
   
    

    DataStore.setData({
      ...DataStore.getData(DataStore.store.size - 1),
      ...dataAfterChange,
    });

    // set table update logic here....
    // access last element in map using map function set (ky, idnex)

    setFetchedData(DataStore.getData(DataStore.store.size - 1));

    // Update References for PK Table

    if (fkReference.type == 'add') {
      Tables = DataStore.getData(DataStore.store.size - 1);

      //find the updated fk

      Tables[fkReference.PrimaryKeyTableName][
        fkReference.PrimaryKeyName.split(' ')[0]
      ].References.push({
        PrimaryKeyTableName: fkReference.PrimaryKeyTableName,
        PrimaryKeyName: fkReference.PrimaryKeyName,
        ReferencesPropertyName: updatedRow?.column + ' ' + updatedRow?.type,
        ReferencesTableName: fkReference.ReferencesTableName,
        IsDestination: true,
        constrainName:
          fkReference.ReferencesTableName +
          '_' +
          updatedRow?.column +
          '_' +
          'fkey',
      });
      console.log('Tables before DataStore update for add fk');
      console.log(Tables);
      DataStore.setData({
        ...DataStore.getData(DataStore.store.size - 1),
        ...Tables,
      });
    }
    if (fkReference.type == 'remove' && updatedRow !== null) {
      let tempRef = [];
      Tables = DataStore.getData(DataStore.store.size - 1);

      let ref =
        Tables[fkReference.PrimaryKeyTableName][
          fkReference.PrimaryKeyName.split(' ')[0]
        ].References;

      for (let i = 0; i < ref.length; i++) {
        if (
          ref[i].ReferencesPropertyName.split(' ')[0] !==
          updatedRow?.column.split(' ')[0]
        ) {
          tempRef.push(ref[i]);
        }
      }
      // assign the tempRef back to the pk table
      Tables[fkReference.PrimaryKeyTableName][
        fkReference.PrimaryKeyName.split(' ')[0]
      ].References = tempRef;

      console.log('tables just before store update for Remove fk:');
      console.log(Tables);
      DataStore.setData({
        ...DataStore.getData(DataStore.store.size - 1),
        ...Tables,
      });
    }
    // accessing datastore.store.get ?
  }

  
  const updateXarrow = useXarrow();

  function mouseOver () {
    setId(id)
  }


  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div
        className="table-Draggable"
        id={id}
        // style={{
        //   height: "auto",
        //   color: "white",
        //   width: "450px",
        //   margin: "20px",
        //   background: "#2b3a42",
        //   borderRadius: "5px",
        //   padding: "3px",
        //   fontFamily: "Arial",
        // }}
      >
        <div className="table-DraggableSub1"
        onMouseDown={mouseOver}
          // style={{
          //   display: 'flex',
          //   justifyContent: 'space-between',
          //   alignItems: 'center',
          // }}
        >
          <div className='table-DraggableSub2' 
          // style={{ fontSize: "24px" }}
          >{id}</div>
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
          editMode={'row'}
          hideFooter={true}
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableColumnSelector={true}
          getRowId={(r) => r.id}
          rowModesModel={rowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.log('logic failed');
            console.log(error);
          }}
          components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{ bgcolor: 'whitesmoke', fontSize: '12px' }}
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
  // console.log("EEEditToolBar", props)
  const { setRows, setRowModesModel } = props;

  

  const handleClick = () => {
    console.log("this is PROPD", props);
    const id = randomId();
    console.log("handleclickID", id);

    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        column: '',
        type: '',
        constraint: '',
        pk: '',
        fk: '',
        reference: [],
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'column' },
    }));
  };

  return (
    <GridToolbarContainer
      className="table-GridToolbarContainer"
      // style={{ height: '30px' }}
    >
      <Button
        color="primary"
        className="table-GridToolbarContainer-Button"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleClick}
        style={{
          position: 'absolute',
          right: '3px',
          margin: 0,
          color: '#2b3a42',
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

  fkReference: {
    PrimaryKeyTableName: string;
    PrimaryKeyName: string;
    ReferencesPropertyName: string;
    ReferencesTableName: string;
    isDestination: boolean;
    constrainName: string;
    type: string;
  };

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
  let references = { column_name: '', references: { type: '' } };
  const [columnList, setcolumnList] = useState<
    (JSX.Element | null | undefined)[]
  >([]);
  const [pkList, setpkList] = useState('');
  const [msg, setMsg] = useState('');
  const [selectedCol, setselectedCol] = useState('');
  const handleClose = () => {
    setFormDialogEditCol('false');

    setOpens(false);
  };

  const handleSubmit = () => {
    // Add state to prevent button
    setFormDialogEditCol('true');
    let PrimaryKeyTableName = pkList;
    let PrimaryKeyName =
      selectedCol + ' ' + fetchedData[pkList][selectedCol].data_type;
    let ReferencesPropertyName =
      formDialogEditRow.row.column + ' ' + formDialogEditRow.row.type;
    let ReferencesTableName: string | null = tablename;
    let isDestination = false;
    let constrainName =
      ReferencesTableName + '_' + formDialogEditRow.row.column + '_' + 'fkey';
    let obj = {};
    if (PrimaryKeyTableName == null) alert('Must Select Primary Table Name');
    else if (PrimaryKeyName == null) alert('Must Select Primary Key Column');
    else if (ReferencesPropertyName == null)
      alert('Error: Reference Property Name Not Set');
    else if (ReferencesTableName == null)
      alert('Error: References Table Not Set');
    else {
      setfkReference({
        PrimaryKeyTableName: PrimaryKeyTableName,
        PrimaryKeyName: PrimaryKeyName,
        ReferencesPropertyName: ReferencesPropertyName,
        ReferencesTableName: ReferencesTableName,
        IsDestination: false,
        constrainName: constrainName,
        type: 'add',
      });

      setOpens(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setpkList(event.target.value);

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
        className="table-Dialog"
        color="dark"
        open={opens}
        onClose={handleClose}
        PaperProps={
          {
            // style: {
            //   //backgroundColor: 'grey', Add color styling here...
            //   boxShadow: 'ffff',
            //   color: 'black',
            // },
          }
        }
        sx={{
          display: 'inline',
          fontWeight: 'bold',
          width: 'auto',
          mx: 0.5,
          fontSize: 14,
        }}
      >
        <DialogTitle>Foreign Key Form</DialogTitle>
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
              formDialogEditRow == undefined ? '' : formDialogEditRow.row.column
            }
            contentEditable={false}
            inputProps={{ readOnly: true }}
          />
          <span>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                width: '235px',
                display: 'inline-block',
                fontSize: 16,
                paddingTop: '10px',
              }}
            >
              Select Primary Key Table
            </InputLabel>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                width: '235px',
                display: 'inline-block',
                fontSize: 16,
                paddingTop: '10px',
              }}
            >
              Select Primary Column Table
            </InputLabel>
          </span>
          <span>
            <Select
              sx={{
                width: '235px',
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={pkList}
              label="Primary Key"
              onChange={handleChange}
            >
              {listOfTables}
            </Select>

            <Select
              sx={{
                width: '235px',
              }}
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
          <Button
            className="table-DialogActions-Button"
            // style={{
            //   color: 'black',
            // }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="table-DialogActions-Button"
            // style={{
            //   color: 'black',
            // }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
