import { Router, Response, Request } from 'express';
import mysqlController from '../controllers/mysqlData.controller';

const mysqlRouter = Router();

mysqlRouter.get('/schema', mysqlController.mysqlQuery, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router with data');
  res.status(200).json(res.locals);
});

mysqlRouter.post('/data', mysqlController.mysqlAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

mysqlRouter.put('/updateRow', mysqlController.mysqlUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

mysqlRouter.delete('/deleteRow', mysqlController.mysqlDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

mysqlRouter.put('/addForeignKey', mysqlController.mysqlAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the mysql router after adding a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { mysqlRouter };