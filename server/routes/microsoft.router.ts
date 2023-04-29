import { Router, Response, Request } from 'express';
import { microsoftQuery } from '../controllers/microsoftData.controller';

const microsoftRouter = Router();

microsoftRouter.get('/schema', microsoftQuery, (_req: Request, res: Response) => {
  console.log('Returned to the microsoft router with data');
  res.status(200).json(res.locals);
});

export { microsoftRouter };