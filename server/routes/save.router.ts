// This is going to be my new place to build out the upgraded saving logic.
import { Router, Response, Request } from 'express';
import saveController from '../controllers/save.controller';
const saveRouter = Router();

//Clone Save
//takes current user email + filename
//Inserts a copy of the current filename into the database named filename_new
saveRouter.post('/cloneSave', saveController.clone, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//Delete Save
//takes in user email + filename
//deletes the query
saveRouter.delete(
  '/deleteSave',
  saveController.delete,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

//Load Save
//Takes in current user email + filename
//returns the schema
saveRouter.get('/loadSave', saveController.load, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//Save
// Takes in current useremail + filename
//updates the schema in the database
saveRouter.post('/save', saveController.save, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//create new Save
//takes in current useremail
// creates a blank database entry with filename "New_Scehma"
saveRouter.post('/newSave', saveController.newSave, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//getAllSaves
//takes in current useremail
// returns an array of all savefile names
saveRouter.get('/allSave', saveController.getAllSaves, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

//update filename
//takes in current useremail+ filename + newfilename
// updates the filename in the database
saveRouter.get(
  '/changeSave',
  saveController.renameSave,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

saveRouter.post(
  '/CreateAndSave',
  saveController.newSave,
  saveController.save,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

export { saveRouter };
