import { Router, Response, Request } from 'express';
import { postgresQuery } from '../controllers/postgresData.controller';

const postgresRouter = Router();

// Retrieve Postgres schema from remote db
postgresRouter.get('/schema', postgresQuery, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router with data')
  //console.log('data we brought back: ', res.locals)
  return res.status(200).json(res.locals);
});

export { postgresRouter };
