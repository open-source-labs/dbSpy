import { Router, Response, Request } from 'express';
import { mysqlQuery, mysqlAddNewRow, mysqlUpdateRow } from '../controllers/mysqlData.controller';

const mysqlRouter = Router();

mysqlRouter.get('/schema', mysqlQuery, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router with data');
  res.status(200).json(res.locals);
});

mysqlRouter.post('/data', mysqlAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

mysqlRouter.post('/updateRow', mysqlUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

export { mysqlRouter };