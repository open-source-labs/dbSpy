import { Router, Response, Request } from 'express';
import postgresController from '../controllers/postgresData.controller';


const postgresRouter = Router();

// Retrieve Postgres schema from remote db
postgresRouter.get('/schema', postgresController.postgresQuery, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router with data');
  return res.status(200).json(res.locals);
});

postgresRouter.post('/data', postgresController.postgresAddNewRow, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after adding a new row');
  return res.status(200).json(res.locals.newRow);
});

postgresRouter.post('/saveNewTable', (_req: Request, res: Response) => {

console.log(_req.body)
})

postgresRouter.put('/updateRow', postgresController.postgresUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

postgresRouter.delete('/deleteRow', postgresController.postgresDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

postgresRouter.put('/addForeignKey', postgresController.postgresAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after adding a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});

export { postgresRouter };
