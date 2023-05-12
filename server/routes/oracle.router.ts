import { Router, Response, Request } from 'express';
import oracleController from '../controllers/oracleData.controller';

const oracleRouter = Router();

// Retrieve Oracle SQL schema and data from REMOTE db
oracleRouter.get('/schema', oracleController.oracleQuery, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router with data');
  return res.status(200).json(res.locals);
});

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
oracleRouter.post('/data', oracleController.oracleAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new row');
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
oracleRouter.patch('/updateRow', oracleController.oracleUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after updating a row');
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
oracleRouter.delete('/deleteRow', oracleController.oracleDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after deleting a row');
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
oracleRouter.post('/addColumn', oracleController.oracleAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
oracleRouter.patch('/updateColumn', oracleController.oracleUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after updating a column');
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
oracleRouter.delete('/deleteColumn', oracleController.oracleDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after deleting a column');
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
oracleRouter.post('/saveNewTable', oracleController.oracleAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
oracleRouter.get('/tableNames', oracleController.oracleGetTableNames, (_req, res) => {
  console.log('Returned to the oracle router after getting all the table names');
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
oracleRouter.delete('/deleteTable', oracleController.oracleDeleteTable, oracleController.oracleQuery, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after deleting a table');
  return res.status(200).json(res.locals);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
oracleRouter.put('/addForeignKey', oracleController.oracleAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a foreign key');
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
oracleRouter.delete('/removeForeignKey', oracleController.oracleRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { oracleRouter };