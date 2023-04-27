import { Router, Response, Request } from 'express';
import { mysqlQuery } from '../controllers/mysqlData.controller';

const mysqlRouter = Router();

mysqlRouter.get('/schema', mysqlQuery, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router with data');
  res.status(200).json(res.locals);
});

export default mysqlRouter;