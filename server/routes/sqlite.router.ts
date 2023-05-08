import { Router, Response, Request } from 'express';
import { sqliteQuery, sqliteAddNewRow, sqliteUpdateRow, sqliteDeleteRow } from '../controllers/sqliteData.controller';

const sqliteRouter = Router();

// Retrieve Postgres schema from remote db
sqliteRouter.get('/schema', sqliteQuery, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router with data');
  return res.status(200).json(res.locals);
});

sqliteRouter.post('/data', sqliteAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

sqliteRouter.post('/updateRow', sqliteUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

sqliteRouter.post('/deleteRow', sqliteDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

export { sqliteRouter };