import { Router, Response, Request } from 'express';
import sqliteController from '../controllers/sqliteData.controller';

const sqliteRouter = Router();

// Retrieve Postgres schema from remote db
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

sqliteRouter.put('/addForeignKey', sqliteController.sqliteAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { sqliteRouter };