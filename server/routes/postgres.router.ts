import { Router, Response, Request } from 'express';
import { getSchema, postgresQuery } from '../controllers/postgresData.controller';

const postgresRouter = Router();

// Retrieve Postgres schema from remote db
postgresRouter.get('/schema', postgresQuery, (_req: Request, res: Response) => {
  console.log('We back in the router baby')
  console.log('data we brought back: ', res.locals.data)
  return res.status(200).json(res.locals.data);
});

export { postgresRouter };
