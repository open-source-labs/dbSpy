import { Router, Response, Request } from 'express';
import { objSchema, getSchema } from '../controllers/mysqlData.controller';


const mysqlRouter = Router();

mysqlRouter.get('/schema', getSchema, objSchema, (_req: Request, res: Response) => {
  res.status(200).json(res.locals.data);
});

export default mysqlRouter;