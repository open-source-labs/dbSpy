import { Router, Response, Request } from 'express';
import sqliteController from '../controllers/sqliteData.controller';

const sqliteRouter = Router();

// Retrieve SQLite schema and data from LOCAL db
sqliteRouter.get('/schema', sqliteController.sqliteQuery, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router with data');
  return res.status(200).json(res.locals);
});
//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
sqliteRouter.post('/data', sqliteController.sqliteAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new row');
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
sqliteRouter.patch('/updateRow', sqliteController.sqliteUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after updating a row');
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
sqliteRouter.delete('/deleteRow', sqliteController.sqliteDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after deleting a row');
  return res.sendStatus(200);
});
//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
sqliteRouter.post('/addColumn', sqliteController.sqliteAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
sqliteRouter.patch('/updateColumn', sqliteController.sqliteUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after updating a column');
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
sqliteRouter.delete('/deleteColumn', sqliteController.sqliteDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after deleting a column');
  return res.sendStatus(200);
});
//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
sqliteRouter.post('/saveNewTable', sqliteController.sqliteAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
sqliteRouter.delete('/deleteTable', sqliteController.sqliteDeleteTable, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after deleting a table');
  return res.sendStatus(200);
});
//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
sqliteRouter.put('/addForeignKey', sqliteController.sqliteAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a foreign key');
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
sqliteRouter.delete('/removeForeignKey', sqliteController.sqliteRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { sqliteRouter };