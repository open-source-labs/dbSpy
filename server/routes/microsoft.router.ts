import { Router, Response, Request } from 'express';
import { microsoftQuery, microsoftAddNewRow, microsoftUpdateRow } from '../controllers/microsoftData.controller';

const microsoftRouter = Router();

microsoftRouter.get('/schema', microsoftQuery, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router with data');
  res.status(200).json(res.locals);
});

microsoftRouter.post('/data', microsoftAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

microsoftRouter.post('/updateRow', microsoftUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

export { microsoftRouter };