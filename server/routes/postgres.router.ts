import { Router } from 'express';

import {
  getAllSchemas,
  getSchema,
  objSchema,
  openSchema,
  postSchema,
  handleQueries,
  saveSchema,
  deleteSchema,
} from '../controllers/postgresData.controller';
import { getLogInfo, setLogInfo } from '../controllers/postgresLog.controller';

const postgresRouter = Router();


postgresRouter.post('/getSchema', getSchema, objSchema, (req, res) => {
  res.status(200).json(res.locals.result);
});

postgresRouter.get('/openSchema', openSchema, (req, res) => {
  res.status(200).json({ ok: 'ok' });
});

postgresRouter.post('/postSchema', postSchema, (req, res) => {
  res.status(200).json([
    {
      columnName: 'People',
      dataType: 'VARCHAR(200)',
      isPrimaryKey: false,
      isForeignKey: false,
    },
    {
      columnName: 'City',
      dataType: 'VARCHAR(200)',
      isPrimaryKey: false,
      isForeignKey: false,
    },
    {
      columnName: 'Job',
      dataType: 'VARCHAR(200)',
      isPrimaryKey: false,
      isForeignKey: false,
    },
  ]);
});

// Receiving an array of strings (queries)
postgresRouter.post('/handleQueries', handleQueries, (req, res) => {
  res.status(200).json({ success: res.locals.success });
});

postgresRouter.post('/saveSchema', saveSchema, (req, res) => {
  res.status(200).send('Save successful!');
});

postgresRouter.post('/deleteSchema', deleteSchema, (req, res) => {
  res.status(200).send('Delete successful!');
});

// New route for getting log info
postgresRouter.post('/getLogs', getLogInfo, (req, res) => {
  res.status(200).json(res.locals.logTable);
});

postgresRouter.post('/setLogs', setLogInfo, (req, res) => {
  return res.status(200);
});

export { postgresRouter };
