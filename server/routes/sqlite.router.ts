import { Router, Response, Request } from 'express';
import { sqliteQuery, sqliteAddNewRow } from '../controllers/sqliteData.controller';

const sqliteRouter = Router();

// Retrieve Postgres schema from remote db
sqliteRouter.get('/schema', sqliteQuery, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router with data');
  return res.status(200).json(res.locals);
});

sqliteRouter.post('/data', sqliteAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the sqlite router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

export { sqliteRouter };