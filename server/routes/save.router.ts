// This is going to be my new place to build out the upgraded saving logic.
import { Router, Response, Request } from 'express';
import saveController from '../controllers/save.controller';
const saveRouter = Router();

//Clone Save
saveRouter.post('/cloneSave', saveController.save, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//Delete Save
saveRouter.delete(
  '/deleteSave',
  saveController.delete,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

//Load Save
saveRouter.get('/loadSave', saveController.load, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//Save Save
saveRouter.post('/save', saveController.save, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//create new Save
saveRouter.post('/newSave', saveController.newSave, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//getAllSaves
saveRouter.get('/allSave', saveController.getAllSaves, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

saveRouter.get(
  '/changeSave',
  saveController.renameSave,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

export { saveRouter };
