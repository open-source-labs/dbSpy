import { Router, Response, Request } from 'express';
import microsoftController from '../controllers/microsoftData.controller';

const microsoftRouter = Router();

// Retrieve Microsoft SQL schema and data from REMOTE db
microsoftRouter.get('/schema', microsoftController.microsoftQuery, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router with data');
  return res.status(200).json(res.locals);
});

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
microsoftRouter.post('/data', microsoftController.microsoftAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a new row');
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
microsoftRouter.patch('/updateRow', microsoftController.microsoftUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after updating a row');
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
microsoftRouter.delete('/deleteRow', microsoftController.microsoftDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after deleting a row');
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
microsoftRouter.post('/addColumn', microsoftController.microsoftAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
microsoftRouter.patch('/updateColumn', microsoftController.microsoftUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after updating a column');
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
microsoftRouter.delete('/deleteColumn', microsoftController.microsoftDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after deleting a column');
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
microsoftRouter.post('/saveNewTable', microsoftController.microsoftAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
microsoftRouter.get('/tableNames', microsoftController.microsoftGetTableNames, (_req, res) => {
  console.log('Returned to the microsoft router after getting all the table names');
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
microsoftRouter.delete('/deleteTable', microsoftController.microsoftDeleteTable, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after deleting a table');
  return res.sendStatus(200);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
microsoftRouter.put('/addForeignKey', microsoftController.microsoftAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a foreign key');
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
microsoftRouter.delete('/removeForeignKey', microsoftController.microsoftRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { microsoftRouter };