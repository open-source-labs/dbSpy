import { Router, Response, Request } from 'express';
import { postgresQuery, postgresAddNewRow } from '../controllers/postgresData.controller';


const postgresRouter = Router();

// Retrieve Postgres schema from remote db
postgresRouter.get('/schema', postgresQuery, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router with data');
  return res.status(200).json(res.locals);
});

postgresRouter.post('/data', postgresAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

postgresRouter.post('/saveNewTable', (_req: Request, res: Response) => {

console.log(_req.body)
})

postgresRouter.post('/addForeignKey',(_req: Request, res: Response) => {
  console.log(_req.body)
})

export { postgresRouter };
