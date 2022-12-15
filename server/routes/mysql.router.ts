import { Router } from 'express';
import { objSchema} from '../controllers/mysqlData.controller.js';
import { getSchema } from '../controllers/mysqlData.controller'

const mysqlRouter = Router();

mysqlRouter.post('/getSchema', getSchema, objSchema, (req, res) => {
    res.status(200).json(res.locals.data);
});

export default mysqlRouter;