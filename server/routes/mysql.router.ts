import { Router, Response, Request } from 'express';
import mysqlController from '../controllers/mysqlData.controller';

const mysqlRouter = Router();

// Retrieve MySQL schema and data from REMOTE db
mysqlRouter.get('/schema', mysqlController.mysqlQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

mysqlRouter.get(
  '/run-query',
  mysqlController.mysqlGetMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.metrics);
  }
);

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
mysqlRouter.post('/addRow', mysqlController.mysqlAddNewRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateRow', mysqlController.mysqlUpdateRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
mysqlRouter.delete('/deleteRow', mysqlController.mysqlDeleteRow, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
mysqlRouter.post('/addColumn', mysqlController.mysqlAddNewColumn, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateColumn', mysqlController.mysqlUpdateColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteColumn', mysqlController.mysqlDeleteColumn, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
mysqlRouter.post('/saveNewTable', mysqlController.mysqlAddNewTable, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
mysqlRouter.get('/tableNames', mysqlController.mysqlGetTableNames, (_req, res) => {
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteTable', mysqlController.mysqlDeleteTable, mysqlController.mysqlQuery, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
mysqlRouter.put('/addForeignKey', mysqlController.mysqlAddForeignKey, (_req: Request, res: Response) => {
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
mysqlRouter.delete('/removeForeignKey', mysqlController.mysqlRemoveForeignKey, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.deletedRow);
});

export { mysqlRouter };