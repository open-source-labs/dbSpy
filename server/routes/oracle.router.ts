import { Router, Response, Request } from 'express';
import oracleController from '../controllers/oracleData.controller';

const oracleRouter = Router();

// Retrieve Oracle SQL schema and data from REMOTE db
oracleRouter.get('/schema', oracleController.oracleQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
oracleRouter.post('/addRow', oracleController.oracleAddNewRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
oracleRouter.patch('/updateRow', oracleController.oracleUpdateRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
oracleRouter.delete('/deleteRow', oracleController.oracleDeleteRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
oracleRouter.post('/addColumn', oracleController.oracleAddNewColumn, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
oracleRouter.patch('/updateColumn', oracleController.oracleUpdateColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
oracleRouter.delete('/deleteColumn', oracleController.oracleDeleteColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
oracleRouter.post('/saveNewTable', oracleController.oracleAddNewTable, oracleController.oracleQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
oracleRouter.get('/tableNames', oracleController.oracleGetTableNames, (_req, res) => {
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
oracleRouter.delete('/deleteTable', oracleController.oracleDeleteTable, oracleController.oracleQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
oracleRouter.put('/addForeignKey', oracleController.oracleAddForeignKey, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
oracleRouter.delete('/removeForeignKey', oracleController.oracleRemoveForeignKey, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.deletedRow);
});

export { oracleRouter };