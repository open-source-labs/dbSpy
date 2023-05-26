import { Router, Response, Request } from 'express';
import sqliteController from '../controllers/sqliteData.controller';

const sqliteRouter = Router();

// Retrieve SQLite schema and data from LOCAL db
sqliteRouter.get('/schema', sqliteController.sqliteQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
sqliteRouter.post('/addRow', sqliteController.sqliteAddNewRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
sqliteRouter.patch('/updateRow', sqliteController.sqliteUpdateRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
sqliteRouter.delete('/deleteRow', sqliteController.sqliteDeleteRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
sqliteRouter.post('/addColumn', sqliteController.sqliteAddNewColumn, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
sqliteRouter.patch('/updateColumn', sqliteController.sqliteUpdateColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
sqliteRouter.delete('/deleteColumn', sqliteController.sqliteDeleteColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
sqliteRouter.post('/saveNewTable', sqliteController.sqliteAddNewTable, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
sqliteRouter.get('/tableNames', sqliteController.sqliteGetTableNames, (_req, res) => {
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
sqliteRouter.delete('/deleteTable', sqliteController.sqliteDeleteTable, sqliteController.sqliteQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
sqliteRouter.put('/addForeignKey', sqliteController.sqliteAddForeignKey, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
sqliteRouter.delete('/removeForeignKey', sqliteController.sqliteRemoveForeignKey, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.deletedRow);
});

export { sqliteRouter };