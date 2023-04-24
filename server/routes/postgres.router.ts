import { Router, Response, Request } from 'express';
import { getSchema } from '../controllers/postgresData.controller';

const postgresRouter = Router();

// Retrieve Postgres schema from remote db
postgresRouter.get('/schema', getSchema, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.data);
});

export { postgresRouter };
