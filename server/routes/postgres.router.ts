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

postgresRouter.patch('/updateRow', postgresController.postgresUpdateRow, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after updating a row');
  return res.status(200).json(res.locals.updatedRow);
});

postgresRouter.delete('/deleteRow', postgresController.postgresDeleteRow, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after deleting a row');
  return res.status(200).json(res.locals.deletedRow);
});

postgresRouter.post('/addColumn', postgresController.postgresAddNewColumn, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after adding a new column');
  return res.status(200).json(res.locals.newColumn);
});

postgresRouter.patch('/updateColumn', postgresController.postgresUpdateColumn, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after updating a column');
  return res.status(200).json(res.locals.updatedColumn);
});

postgresRouter.delete('/deleteColumn', postgresController.postgresDeleteColumn, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after deleting a column');
  return res.status(200).json(res.locals.deletedColumn);
});

postgresRouter.post('/saveNewTable', postgresController.postgresAddNewTable, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after adding a new table');
  return res.status(200).json(res.locals.newTable);
});

postgresRouter.delete('/deleteTable', postgresController.postgresDeleteTable, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after deleting a table');
  return res.sendStatus(200);
});

postgresRouter.put('/addForeignKey', postgresController.postgresAddForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after adding a foreign key');
  return res.sendStatus(200);
});

postgresRouter.delete('/removeForeignKey', postgresController.postgresRemoveForeignKey, (_req: Request, res: Response) => {
  console.log('Returned to the postgres router after removing a foreign key');
  return res.status(200).json(res.locals.deletedRow);
});


// postgresRouter.post('/saveNewTable', (_req: Request, res: Response) => {

// console.log(_req.body)
// })

export { postgresRouter };
