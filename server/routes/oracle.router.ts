import { Router, Response, Request } from 'express';
import { oracleQuery } from '../controllers/oracleData.controller';

const oracleRouter = Router();

oracleRouter.get('/schema', oracleQuery, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router with data');
  // console.log('data: ', res.locals)
  return res.status(200).json(res.locals);
});

export { oracleRouter };