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
import { Table } from 'typeorm';
config();

interface GlobalError {
  log: string;
  status: number;
  message: string | { err: string };
}

const saveController = {
  getSavedQueries: async (req: Request, res: Response, next: NextFunction) => {
    log.info('[saveCtrl - getSavedQueries] Beginning to load saved queries');
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      // query to get all necessary data to the FE
      const userEmail = user.email;
      const getQueries: string = `SELECT name, query, query_date, exec_time, planning_time, total_cost, actual_total_time, node_type, relation_name, plan_rows, actual_rows, shared_hit_blocks, shared_read_blocks FROM queries WHERE email = ? ORDER BY id DESC`;
      const queryVal = await pool.query(getQueries, [userEmail]);
      res.locals.savedQueries = queryVal;
      return next();
    } catch (err) {
      console.error('getSavedQueries ERROR:', err);
      return next({
        log: 'An error occurred in saveController.getSavedQueries',
        message: 'Something went wrong in the loading process',
        status: 400,
      });
    }
  },

  // clone an existing save
  clone: async (req: Request, res: Response, next: NextFunction) => {
    log.info('[saveCtrl - cloneSchema] Beginning cloning process');
    //necessary information to complete request
    const { SaveName } = req.body;
    const { email } = req.session;
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
      //queries
      //first we need to retrieve the schema
      //second we create a new table entry with that schema data as an argument
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
      const tableData = getSchema[0][0].TableData;
      // create
      const createCloneQuery =
        'INSERT INTO saveddb(email,SaveName,DataType,SaveData,TableData) VALUES (?,?,?,?,?)';
      const createCloneValues = [email, newName, type, schema, tableData];
      const newEntry = await pool.query(createCloneQuery, createCloneValues);
      console.log(newEntry);
      res.locals.message = 'new Entry Successfully created';

      log.info('[saveCtrl - cloneSchema] Queries to database did not throw an error');
      return next();
    } catch (err) {
      return next({
        log: 'MySQL query failed inside saveController.clone',
        message: 'something went wrong in the clone process',
        status: 400,
      });
    }
  },

  //save over currently selected save
  save: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - saveSchema] Beginning to save user's schema...");
    //const {email} = req.session; // this will change to session when live
    const { SaveName, schema, TableData } = req.body;
    console.log('savename: ', SaveName);
    console.log('schema: ', schema);
    console.log('TABLEDATA: ', TableData);
    const { email } = req.session;
    console.log('here in saveSchema: email, SaveName, schema');
    console.log(email, SaveName, schema);
    try {
      // all schema data is on table saveddb in the SaveData Column.
      const saveSchemaQuery: string =
        'UPDATE saveddb SET SaveData = ?, TableData = ? WHERE email = ? AND SaveName = ?'; // update existing with schema
      const values = [schema, TableData, email, SaveName];
      console.log('values: ', values);
      const dataSlot = (await pool.query(saveSchemaQuery, values)) as RowDataPacket[];
      res.locals.message = 'Schema Save Completed';
      console.log('schema saved! in res.locals.message');
      return next();
    } catch (err) {
      return next({
        log: `An error occurred in saveController.save: ${err}`,
        message: 'something went wrong in the save schema process',
        status: 400,
      });
    }
  },

  //delete current save
  delete: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[deleteCtrl - deleteSchema] Beginning to delete user's schema...");
    const { SaveName } = req.params;
    const { email } = req.session;
    // console.log(email, SaveName);
    try {
      const deleteSaveQuery: string = `DELETE FROM saveddb WHERE email = ? AND SaveName = ?`;
      const values = [email, SaveName];
      await pool.query(deleteSaveQuery, values);
      res.locals.message = 'Deletion Completed';
      return next();
    } catch (err) {
      return next({
        log: 'An error occurred in saveController.delete',
        message: 'something went wrong in the deletion process',
        status: 400,
      });
    }
  },

  //load current save
  load: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[loadCtrl - loadSchema] Beginning to load user's schema...");
    const { SaveName } = req.query;
    const { email } = req.session;
    console.log('SaveName: ', req.query);
    console.log('email: ', req.session);

    try {
      const loadQuery: string = `SELECT SaveData,TableData FROM saveddb WHERE email = ? AND SaveName = ?`;
      const values = [email, SaveName];

      const loadData = (await pool.query(loadQuery, values)) as RowDataPacket[];
      // console.log("loadData[0][0]", loadData[0][0]);
      res.locals.data = loadData[0][0].SaveData;
      res.locals.tableData = loadData[0][0].TableData;
      return next();
    } catch (err) {
      return next({
        log: 'An error occurred in saveController.load',
        message: 'something went wrong while trying to load',
        status: 400,
      });
    }
    //will need to request current database selected from front end (by email/name)
    //include an initial error for no database selected
  },
  //create new save
  newSave: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - newSave] Beginning to load user's schema...");
    const { SaveName } = req.body;
    const { email } = req.session;
    console.log('157', email, SaveName);
    
    const newSaveQuery = 'INSERT INTO saveddb(email,SaveName,SaveData) VALUES (?,?,?)';
    const values = [email, SaveName, '{}'];
    try {
      const saveData = await pool.query(newSaveQuery, values);
      console.log('saveDataaa: ', saveData);
      return next();
    } catch (err) {
      return next({
        log: 'An error occurred in saveController.newSave',
        message: 'something went wrong in the creation process',
        status: 400,
      });
    }
  },
  //update a saved name in the database
  renameSave: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - renameSave] Beginning to load user's schema...");
    const { SaveName, OldName } = req.body;
    const { email } = req.session;
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
        log: 'An error occurred in saveController.renameSave',
        message: 'something went wrong in the deletion process',
        status: 400,
      });
    }
  },

  getAllSaves: async (req: Request, res: Response, next: NextFunction) => {
    log.info("[saveCtrl - renameSave] Beginning to load user's schema...");
    const { email } = req.session;
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
