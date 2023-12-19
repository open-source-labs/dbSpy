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

const saveController = {
  // clone an existing save
  clone: async (req: Request, res: Response, next: NextFunction) => {
    log.info('[saveCtrl - cloneSchema] Begining cloneing process');
    //necesary information to complete request
    const { email, SaveName } = req.body;
    //type checking
    if (typeof email !== 'string' || typeof SaveName !== 'string') {
      next({
        log: 'input type was not a string',
        message: 'invalid inputs',
        status: 400,
      });
    }
    const newName: string = SaveName + '_new';
    try {
      //querys
      //first we need to retrieve the schema
      //second we create a new table entry with that schema data as an arguement
      const getSchemaQuery: string =
        'SELECT SaveData FROM saveddb WHERE email = ? AND SaveName = ?';
      const getSchemaValues = [email, SaveName];
      const getSchema = (await pool.query(
        getSchemaQuery,
        getSchemaValues
      )) as RowDataPacket[];
      //grabbing the data off of the SaveData of the current Object
      const schema = getSchema[0][0].SaveData;
      const type = getSchema[0][0].DataType;
      // create
      const createCloneQuery =
        'INSERT INTO saveddb(email,SaveName,DataType,SaveData) VALUES (?,?,?,?)';
      const createCloneValues = [email, newName, type, schema];
      const newEntry = await pool.query(createCloneQuery, createCloneValues);
      console.log(newEntry);
      res.locals.message = 'new Entry Succesfully created';

      log.info('[saveCtrl - cloneSchema] Queries to database did not throw an error');
      return next();
    } catch (err) {
      return next({
        log: 'mySQL query failed inside saveController.clone',
        message: 'something went wrong in the clone process',
        status: 400,
      });
    }
  },

  //save over currently selected save
  save: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - saveSchema] Begining to save user's schema...");
    //const {email} = req.session; // this will change to session when live
    const { email, SaveName, schema } = req.body;
    console.log(email, SaveName, schema);
    try {
      // all schema data is on table saveddb in the SaveData Column.
      const saveSchemaQuery: string =
        'UPDATE saveddb SET SaveData = ? WHERE email = ? AND SaveName = ?'; // update existing with schema
      const values = [schema, email, SaveName];

      const dataSlot = (await pool.query(saveSchemaQuery, values)) as RowDataPacket[];
      res.locals.message = 'Schema Save Completed';
      return next();
    } catch (err) {
      return next({
        log: 'An error occured in saveController.save',
        message: 'something went wrong in the save schema process',
        status: 400,
      });
    }
  },

  //delete current save
  delete: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[deleteCtrl - deleteSchema] Begining to deleteing user's schema...");

    const { email, SaveName } = req.body;
    console.log(email, SaveName);
    try {
      const deleteSaveQuery: string = `DELETE FROM saveddb WHERE email = ? AND SaveName = ?`;
      const values = [email, SaveName];
      await pool.query(deleteSaveQuery, values);
      res.locals.message = 'Deletion Completed';
      return next();
    } catch (err) {
      return next({
        log: 'An error occured in saveController.delete',
        message: 'something went wrong in the deletion process',
        status: 400,
      });
    }
  },

  //load current save
  load: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[loadCtrl - loadSchema] Begining to load user's schema...");
    const { email, SaveName } = req.body;
    console.log(email, SaveName);

    try {
      const loadQuery: string = `SELECT SaveData FROM saveddb WHERE email = ? AND SaveName = ?`;
      const values = [email, SaveName];

      const loadData = (await pool.query(loadQuery, values)) as RowDataPacket[];
      console.log(loadData[0][0].SaveData);
      res.locals.data = loadData[0][0].SaveData;
      return next();
    } catch (err) {
      return next({
        log: 'An error occured in saveController.load',
        message: 'something went wrong while trying to load',
        status: 400,
      });
    }
    // will need to request current database selected from front end (by email/name)
    //include an initial error for no database selected
  },
  //create new save
  newSave: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - newSave] Begining to load user's schema...");
    const { email, SaveName } = req.body;
    console.log(email, SaveName);

    const newSaveQuery = 'INSERT INTO saveddb(email,SaveName,SaveData) VALUES (?,?,?)';
    const values = [email, SaveName, {}];
    try {
      const saveData = await pool.query(newSaveQuery, values);
      console.log(saveData);
      return next();
    } catch (err) {
      return next({
        log: 'An error occured in saveController.newSave',
        message: 'something went wrong in the creation process',
        status: 400,
      });
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
      return next({
        log: 'An error occured in saveController.renameSave',
        message: 'something went wrong in the deletion process',
        status: 400,
      });
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
      console.log(allSaves[0]);
      res.locals.data = allSaves[0];
      return next();
    } catch (err) {
      return next(err);
    }
  },
};
export default saveController;
