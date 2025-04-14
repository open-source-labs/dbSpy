// This is going to be my new place to build out the upgraded saving logic.
// Everything seems fine. The only potential concern is testing the volume of data being allowed to be saved by users.
import { Router, Response, Request } from 'express';
import bodyParser from 'body-parser';
import saveController from '../controllers/save.controller';
import { isAuthenticated } from '../controllers/user.controller';

const saveRouter = Router();

// Apply bodyParser with a larger limit
// Might be good to in the future limit data storage per user. rather then per file.
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//Load Saved Queries
saveRouter.get(
  '/saved-queries',
  isAuthenticated,
  saveController.getSavedQueries,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.savedQueries);
  }
);

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
  '/deleteSave/:SaveName',
  saveController.delete,
  (_req: Request, res: Response) => {
    return res.status(204).json(res.locals.message);
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
saveRouter.patch('/save', saveController.save, (_req: Request, res: Response) => {
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

//combination of two middlewears listed above.
saveRouter.post(
  '/CreateAndSave',
  saveController.newSave,
  saveController.save,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

export { saveRouter };
