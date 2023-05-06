import { Router, Response, Request } from 'express';
import { sqliteQuery } from '../controllers/sqliteData.controller';

const sqliteRouter = Router();

// Retrieve Postgres schema from remote db
sqliteRouter.get('/schema', sqliteQuery, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router with data');
  return res.status(200).json(res.locals);
});

export { sqliteRouter };