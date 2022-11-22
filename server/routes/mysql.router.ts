import { Router } from 'express';
import { objSchema } from '../controllers/mysqlData.controller.js';
import { getSchema } from '../controllers/mysqlData.controller'
//Note: LogController is not yet built
import { getLogInfo } from "../controllers/mysqlLog.controller.js"

const mysqlRouter = Router();

mysqlRouter.post('/getSchema', getSchema, objSchema, (req, res) => {
    res.status(200).json(res.locals.data);
});

// Route for getting log info
mysqlRouter.post('/getLogs', getLogInfo, (req, res) => {
    res.status(200).json(res.locals.logTable);
});

export default mysqlRouter;

