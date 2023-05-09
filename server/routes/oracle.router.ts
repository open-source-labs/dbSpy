import { Router, Response, Request } from 'express';
import oracleController from '../controllers/oracleData.controller';

const oracleRouter = Router();

oracleRouter.get('/schema', oracleController.oracleQuery, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router with data');
  // console.log('data: ', res.locals)
  return res.status(200).json(res.locals);
});

oracleRouter.post('/data', oracleController.oracleAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

oracleRouter.put('/updateRow', oracleController.oracleUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

oracleRouter.delete('/deleteRow', oracleController.oracleDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

oracleRouter.put('/addForeignKey', oracleController.oracleAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the oracle router after adding a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { oracleRouter };