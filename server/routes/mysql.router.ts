import { Router, Response, Request } from 'express';
import mysqlController from '../controllers/mysqlData.controller';

const mysqlRouter = Router();

// Retrieve MySQL schema and data from REMOTE db
mysqlRouter.get('/schema', mysqlController.mysqlQuery, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router with data');
  return res.status(200).json(res.locals);
});

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
mysqlRouter.post('/data', mysqlController.mysqlAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after adding a new row');
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateRow', mysqlController.mysqlUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after updating a row');
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
mysqlRouter.delete('/deleteRow', mysqlController.mysqlDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after deleting a row');
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
mysqlRouter.post('/addColumn', mysqlController.mysqlAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateColumn', mysqlController.mysqlUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after updating a column');
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteColumn', mysqlController.mysqlDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after deleting a column');
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
mysqlRouter.post('/saveNewTable', mysqlController.mysqlAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
mysqlRouter.get('/tableNames', mysqlController.mysqlGetTableNames, (_req, res) => {
  console.log('Returned to the mysql router after getting all the table names');
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteTable', mysqlController.mysqlDeleteTable, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after deleting a table');
  return res.sendStatus(200);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
mysqlRouter.put('/addForeignKey', mysqlController.mysqlAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after adding a foreign key');
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
mysqlRouter.delete('/removeForeignKey', mysqlController.mysqlRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { mysqlRouter };