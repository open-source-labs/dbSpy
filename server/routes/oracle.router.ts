import { Router, Response, Request } from 'express';
import { oracleQuery, oracleAddNewRow } from '../controllers/oracleData.controller';

const oracleRouter = Router();

oracleRouter.get('/schema', oracleQuery, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router with data');
  // console.log('data: ', res.locals)
  return res.status(200).json(res.locals);
});

oracleRouter.post('/data', oracleAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

export { oracleRouter };