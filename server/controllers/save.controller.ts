import { Request, Response, NextFunction } from 'express';
import { TableColumns, TableColumn, TableSchema, RefObj } from '@/Types';
import {
  dbConnect,
  addNewDbRow,
  updateRow,
  deleteRow,
  addNewDbColumn,
  updateDbColumn,
  deleteColumn,
  addNewTable,
  deleteTable,
  addForeignKey,
  removeForeignKey,
  getTableNames,
} from './helperFunctions/universal.helpers';
import log from '../logger/index';
import { RowDataPacket } from 'mysql2';
import pool from '../models/userModel';
import { config } from 'dotenv';
import { findUser } from './user.controller';
import { BsInfoSquareFill } from 'react-icons/bs';
config();

interface GlobalError {
  log: string;
  status: number;
  message: string | { err: string };
}

/*  const { email, SaveName, schema, DataType } = req.body;
    console.log(email, SaveName, schema, DataType);
    try {
      const user = (await pool.query(
        `SELECT * FROM users WHERE email = ?;`,
        email
      )) as RowDataPacket[];

      console.log('=======');
      console.log('user[0][0]');
      console.log('=======');
      // i just discovered an issue where multiple users are being creating
      console.log(user[0][0]); */

//const foundUser = (await findUser(email)) as RowDataPacket[][];

const saveController = {
  // clone an existing save
  clone: async (req: Request, res: Response, next: NextFunction) => {
    log.info('[saveCtrl - cloneSchema] Begining cloneing process');
    // will need to request current database selected from front end (by email/name)
    // will find then create a new instance of the database with the string = string + _new as name
    //include an initial error for no database selected

    return next();
  },

  //save over currently selected save
  save: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - saveSchema] Begining to save user's schema...");
    //const {email} = req.session; // this will change to session when live
    const { email, SaveName, schema, DataType } = req.body;
    console.log(email, SaveName, schema, DataType);
    try {
      const user = (await pool.query(
        `SELECT * FROM users WHERE email = ?;`,
        email
      )) as RowDataPacket[];

      console.log('=======');
      console.log('user[0][0]');
      console.log('=======');
      // i just discovered an issue where multiple users are being creating
      console.log(user[0][0]);

      // I've practiced finding a user. time to get into the MEAT
      const dataQueryThree: string = 'UPDATE saveddb SET SaveData = ?'; // update existing with schema
      const values = [email, SaveName, schema, DataType];

      const dataSlot = (await pool.query(dataQueryThree, values)) as RowDataPacket[];
      console.log('dataslot');
      console.log(dataSlot[0]);

      return next();
    } catch {
      console.log('uh oh our dataquery might have failed');
    }
    try {
    } catch {}
    //check, and see if there is a database saved under the current name.
    //if true -you updated the value to the new schema passed in
    //else false - create a new database save in the mySQL saveddb table
    //will need to request current database selected from front end (by email/name)
    //will update the query with the current state of the database
  },

  //delete current save
  delete: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[deleteCtrl - deleteSchema] Begining to deleteing user's schema...");
    //will need to request current database selected from the front end (by email/name)
    //include an initial error for no database selected
    const { email, SaveName } = req.body;
    console.log(email, SaveName);
    pool.query(`DELETE FROM savedb WHERE email = ? AND SaveName = ?`, [email, SaveName]);
    return next();
  },

  //load current save
  load: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[loadCtrl - loadSchema] Begining to load user's schema...");
    const { email, SaveName } = req.body;
    console.log(email, SaveName);
    const loadData = pool.query(`SELECT * WHERE email = ? AND SaveName = ?`, [
      email,
      SaveName,
    ]);
    console.log(loadData);
    res.locals.loadData = loadData;
    return next();
    // will need to request current database selected from front end (by email/name)
    //include an initial error for no database selected
  },
  //create new save
  newSave: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - newSave] Begining to load user's schema...");
    const { email, SaveName, DataType } = req.body;
    console.log(email, SaveName, DataType);

    const newSaveQuery = 'INSERT INTO saveddb(email,SaveName,DataType) VALUES (?,?,?)';
    const values = [email, SaveName, DataType];
    try {
      const saveData = await pool.query(newSaveQuery, values);
      console.log(saveData);
      return next();
    } catch (err) {
      return next(err);
    }
  },
  //update a saves name in the database
  renameSave: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - renameSave] Begining to load user's schema...");
    const { email, SaveName, OldName } = req.body;
    console.log(email, OldName, SaveName);
    if (
      typeof email !== 'string' ||
      typeof OldName !== 'string' ||
      typeof SaveName !== 'string'
    ) {
      return next({
        log: 'invalid inputs',
        message: 'invalid inputs',
        status: 300,
      });
    }
    try {
      const renameSaveQuery: string =
        'UPDATE saveddb SET SaveName = ? WHERE SaveName = ? AND email = ?';
      const values = [SaveName, OldName, email];
      await pool.query(renameSaveQuery, values);
      return next();
    } catch (err) {
      return next(err);
    }
  },

  getAllSaves: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - renameSave] Begining to load user's schema...");
    const { email } = req.body;
    console.log(email);
    try {
      const getSavesQuery: string = 'SELECT SaveName FROM saveddb WHERE email =?';
      const values = [email];
      const allSaves = await pool.query(getSavesQuery, values);
      console.log(allSaves);
      res.locals.saves = allSaves;
      return next();
    } catch (err) {
      return next(err);
    }
  },
};
export default saveController;

//The original save system relied on using a single entry in a data column on each user.
// I have added a new primary->foreighnkey pair to have have a seperate table that can infinitely grow
// Each table will end up having to have a name, and data, and possibly type.
//I reccomend mySQL workbench plus the google doc for accessing this information.

/*
// Save currentSchema into database
export const saveSchema: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info("[userCtrl - saveSchema] Saving user's schema...");
  const { schema } = req.body;
  const { email } = req.session;

  if (typeof email !== 'string' || typeof schema !== 'string') {
    return res.status(400).json({ error: 'User data must be strings' });
  }

  const updateColQuery: string = `UPDATE users SET dbs = ? WHERE email = ?;`;
  try {
    await pool.query(updateColQuery, [schema, email]);
    log.info('[userCtrl - saveSchema] New schema saved successfully');

    return next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: GlobalError = {
        log: '[userCtrl - saveSchema] Failed to save new schema: ' + err.message,
        status: 500,
        message: 'Failed to save new schema',
      };

      return next(error);
    } else {
      return next(err);
    }
  }
};


// Retrieve saved schema
export const retrieveSchema: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.info("[userCtrl - retrvSchema] Retrieving user's saved schema");

  try {
    const { email } = req.session;
    const updateColQuery: string = `SELECT dbs FROM users WHERE email = ?;`;
    const data = (await pool.query(updateColQuery, [email])) as RowDataPacket[];

    if (data[0][0] && data[0][0].dbs) {
      res.locals.data = data[0][0].dbs;

      return res.status(200).json(res.locals.data);
    } else {
      return res.sendStatus(204);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: GlobalError = {
        log: '[userCtrl - retrvSchema] Failed to retrieve saved schema: ' + err.message,
        status: 500,
        message: 'Failed to retrieve saved schema',
      };

      return next(error);
    } else {
      return next(err);
    }
  }
};



*/
