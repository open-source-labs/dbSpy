import { Router, Response, Request } from 'express';
import sqliteController from '../controllers/sqliteData.controller';

const sqliteRouter = Router();

// Retrieve sqlite schema from remote db
sqliteRouter.get('/schema', sqliteController.sqliteQuery, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router with data');
  return res.status(200).json(res.locals);
});

sqliteRouter.post('/data', sqliteController.sqliteAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

sqliteRouter.patch('/updateRow', sqliteController.sqliteUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

sqliteRouter.delete('/deleteRow', sqliteController.sqliteDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

sqliteRouter.post('/addColumn', sqliteController.sqliteAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});

sqliteRouter.patch('/updateColumn', sqliteController.sqliteUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after updating a column');
  return res.status(200).json(res.locals.updatedColumn);
});

sqliteRouter.delete('/deleteColumn', sqliteController.sqliteDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after deleting a column');
  return res.status(200).json(res.locals.deletedColumn);
});

sqliteRouter.post('/saveNewTable', sqliteController.sqliteAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});

sqliteRouter.delete('/deleteTable', sqliteController.sqliteDeleteTable, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after deleting a table');
  return res.sendStatus(200);
});

sqliteRouter.put('/addForeignKey', sqliteController.sqliteAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a foreign key');
  return res.sendStatus(200);
});

sqliteRouter.delete('/removeForeignKey', sqliteController.sqliteRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { sqliteRouter };