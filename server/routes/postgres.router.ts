import { Router, Response, Request } from 'express';
import postgresController from '../controllers/postgresData.controller';


const postgresRouter = Router();

// Retrieve Postgres schema and data from REMOTE db
postgresRouter.get('/schema', postgresController.postgresQuery, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router with data');
  return res.status(200).json(res.locals);
});

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
postgresRouter.post('/data', postgresController.postgresAddNewRow, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after adding a new row');
  return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
postgresRouter.patch('/updateRow', postgresController.postgresUpdateRow, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after updating a row');
  return res.sendStatus(200);
});
//----------------DELETE ROW----------------------------------------------------------------------------------------------------
postgresRouter.delete('/deleteRow', postgresController.postgresDeleteRow, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after deleting a row');
  return res.sendStatus(200);
});

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
postgresRouter.post('/addColumn', postgresController.postgresAddNewColumn, (_req: Request, res: Response) => {

  const { defaultValue, isNullable, isPrimary, name, type, tableName } = _req.body
  //return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
postgresRouter.patch('/updateColumn', postgresController.postgresUpdateColumn, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after updating a column');
  return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
postgresRouter.delete('/deleteColumn', postgresController.postgresDeleteColumn, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after deleting a column');
  return res.sendStatus(200);
});

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
postgresRouter.post('/saveNewTable', postgresController.postgresAddNewTable, postgresController.postgresQuery, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after adding a new table');
  return res.status(200).json(res.locals);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
postgresRouter.get('/tableNames', postgresController.postgresGetTableNames, (_req, res) => {
  //console.log('Returned to the postgres router after getting all the table names');
  return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
postgresRouter.delete('/deleteTable', postgresController.postgresDeleteTable, postgresController.postgresQuery, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after deleting a table');
  return res.status(200).json(res.locals);
});

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
postgresRouter.put('/addForeignKey', postgresController.postgresAddForeignKey, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after adding a foreign key');
  return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
postgresRouter.delete('/removeForeignKey', postgresController.postgresRemoveForeignKey, (_req: Request, res: Response) => {
  //console.log('Returned to the postgres router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

// postgresRouter.post('/saveNewTable', (_req: Request, res: Response) => {

//console.log(_req.body)
// })

export { postgresRouter };
