import { Router, Response, Request } from 'express';
import microsoftController from '../controllers/microsoftData.controller';

const microsoftRouter = Router();

microsoftRouter.get('/schema', microsoftController.microsoftQuery, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router with data');
  return res.status(200).json(res.locals);
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

microsoftRouter.post('/addColumn', microsoftController.microsoftAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});

microsoftRouter.patch('/updateColumn', microsoftController.microsoftUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after updating a column');
  return res.status(200).json(res.locals.updatedColumn);
});

microsoftRouter.delete('/deleteColumn', microsoftController.microsoftDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after deleting a column');
  return res.status(200).json(res.locals.deletedColumn);
});

microsoftRouter.post('/saveNewTable', microsoftController.microsoftAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});

microsoftRouter.delete('/deleteTable', microsoftController.microsoftDeleteTable, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after deleting a table');
  return res.sendStatus(200);
});

microsoftRouter.put('/addForeignKey', microsoftController.microsoftAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after adding a foreign key');
  return res.sendStatus(200);
});

microsoftRouter.delete('/removeForeignKey', microsoftController.microsoftRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { microsoftRouter };