import { Router, Response, Request } from 'express';
import microsoftController from '../controllers/microsoftData.controller';

const microsoftRouter = Router();

microsoftRouter.get('/schema', microsoftController.microsoftQuery, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router with data');
  res.status(200).json(res.locals);
});

microsoftRouter.post('/data', microsoftController.microsoftAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

microsoftRouter.patch('/updateRow', microsoftController.microsoftUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

microsoftRouter.delete('/deleteRow', microsoftController.microsoftDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

microsoftRouter.put('/addForeignKey', microsoftController.microsoftAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { microsoftRouter };