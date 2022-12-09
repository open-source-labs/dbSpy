import { Router } from 'express';

import {
  getSchema,
  handleQueries,
} from '../controllers/postgresData.controller';
import { getLogInfo, setLogInfo } from '../controllers/postgresLog.controller';

const postgresRouter = Router();

// TODO: Make RESTFUL API
postgresRouter.post('/getSchema', getSchema, (req, res) => {
  return res.status(200).json(res.locals.data);
});

// TODO: Review following unused handlers: No function body -- QUERY lead?
// Receiving an array of strings (queries)
postgresRouter.post('/handleQueries', handleQueries, (req, res) => {
  return res.status(200).json({ success: res.locals.success });
});

// New route for getting log info
postgresRouter.post('/getLogs', getLogInfo, (req, res) => {
  return res.status(200).json(res.locals.logTable);
});

postgresRouter.post('/setLogs', setLogInfo, (req, res) => {
  return res.status(200);
});

export { postgresRouter };
