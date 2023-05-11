import { Router, Response, Request } from 'express';
import oracleController from '../controllers/oracleData.controller';

const oracleRouter = Router();

oracleRouter.get('/schema', oracleController.oracleQuery, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router with data');
  return res.status(200).json(res.locals);
});

oracleRouter.post('/data', oracleController.oracleAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

oracleRouter.patch('/updateRow', oracleController.oracleUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

oracleRouter.delete('/deleteRow', oracleController.oracleDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

oracleRouter.post('/addColumn', oracleController.oracleAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});

oracleRouter.patch('/updateColumn', oracleController.oracleUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after updating a column');
  return res.status(200).json(res.locals.updatedColumn);
});

oracleRouter.delete('/deleteColumn', oracleController.oracleDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after deleting a column');
  return res.status(200).json(res.locals.deletedColumn);
});

oracleRouter.post('/saveNewTable', oracleController.oracleAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});

oracleRouter.delete('/deleteTable', oracleController.oracleDeleteTable, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after deleting a table');
  return res.sendStatus(200);
});

oracleRouter.put('/addForeignKey', oracleController.oracleAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a foreign key');
  return res.sendStatus(200);
});

oracleRouter.delete('/removeForeignKey', oracleController.oracleRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { oracleRouter };