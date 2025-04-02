import { Router, Response, Request } from 'express';
import postgresController from '../controllers/postgresData.controller';

const postgresRouter = Router();

// Retrieve Postgres schema and data from REMOTE db
postgresRouter.get(
  '/schema',
  postgresController.postgresQuery,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

postgresRouter.get(
  '/run-query',
  postgresController.postgresGetMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.metrics);
  }
);

postgresRouter.post(
  '/save-query',
  postgresController.postgresSaveQuery,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.savedQuery);
  }
);

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
postgresRouter.post(
  '/addRow',
  postgresController.postgresAddNewRow,
  (_req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
postgresRouter.patch(
  '/updateRow',
  postgresController.postgresUpdateRow,
  (_req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);
//----------------DELETE ROW----------------------------------------------------------------------------------------------------
postgresRouter.delete(
  '/deleteRow',
  postgresController.postgresDeleteRow,
  (_req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
postgresRouter.post(
  '/addColumn',
  postgresController.postgresAddNewColumn,
  (_req: Request, res: Response) => {
    return res.status(201).json(res.locals.newColumn);
  }
);
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
postgresRouter.patch(
  '/updateColumn',
  postgresController.postgresUpdateColumn,
  (_req: Request, res: Response) => {
    return res.sendStatus(201);
  }
);
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
postgresRouter.delete(
  '/deleteColumn',
  postgresController.postgresDeleteColumn,
  (_req: Request, res: Response) => {
    return res.sendStatus(201);
  }
);

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
postgresRouter.post(
  '/saveNewTable',
  postgresController.postgresAddNewTable,
  postgresController.postgresQuery,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
postgresRouter.get(
  '/tableNames',
  postgresController.postgresGetTableNames,
  (_req, res) => {
    return res.status(200).json(res.locals.tableNames);
  }
);
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
postgresRouter.delete(
  '/deleteTable',
  postgresController.postgresDeleteTable,
  postgresController.postgresQuery,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
postgresRouter.put(
  '/addForeignKey',
  postgresController.postgresAddForeignKey,
  (_req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
postgresRouter.delete(
  '/removeForeignKey',
  postgresController.postgresRemoveForeignKey,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.deletedRow);
  }
);

export { postgresRouter };
