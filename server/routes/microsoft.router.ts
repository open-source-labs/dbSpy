import { Router, Response, Request } from 'express';
import microsoftController from '../controllers/microsoftData.controller';

const microsoftRouter = Router();

// Retrieve Microsoft SQL schema and data from REMOTE db
microsoftRouter.get('/schema', microsoftController.microsoftQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
microsoftRouter.post('/addRow', microsoftController.microsoftAddNewRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
microsoftRouter.patch('/updateRow', microsoftController.microsoftUpdateRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
microsoftRouter.delete('/deleteRow', microsoftController.microsoftDeleteRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
microsoftRouter.post('/addColumn', microsoftController.microsoftAddNewColumn, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
microsoftRouter.patch('/updateColumn', microsoftController.microsoftUpdateColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
microsoftRouter.delete('/deleteColumn', microsoftController.microsoftDeleteColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
microsoftRouter.post('/saveNewTable', microsoftController.microsoftAddNewTable, microsoftController.microsoftQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
microsoftRouter.get('/tableNames', microsoftController.microsoftGetTableNames, (_req, res) => {
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
microsoftRouter.delete('/deleteTable', microsoftController.microsoftDeleteTable, microsoftController.microsoftQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
microsoftRouter.put('/addForeignKey', microsoftController.microsoftAddForeignKey, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
microsoftRouter.delete('/removeForeignKey', microsoftController.microsoftRemoveForeignKey, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.deletedRow);
});

export { microsoftRouter };