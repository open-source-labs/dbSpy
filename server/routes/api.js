// Note: Perhaps use of params for this section would be useful, for instance
// router.get('/getSchema/:id');

import { Router } from 'express';
import {
  getAllSchemas,
  testDrop,
  getSchema,
  objSchema,
  openSchema,
  postSchema,
  handleQueries,
  saveSchema,
  deleteSchema,
} from '../controllers/dataController';
import { getLogInfo, setLogInfo } from '../controllers/loggingController';

// import { dummydata } from '../dummy.ts';

const router = Router();

/**
 * Router will have
 * getSchema Check
 * postSchema Check
 * saveSchema Check
 * deleteSchema Check
 * openSchema Check
 * getAllSchemas Check
 *
 * Home
 * Login
 * Display
 * Logout
 */
router.get('/getAllSchemas', getAllSchemas, (req, res) => {
  res.status(200).json({ ok: 'ok' });
});

router.get('/testDrop', testDrop, (req, res) => {
  res.status(200).json(res.locals.testresponse);
});

router.post('/getSchema', getSchema, objSchema, (req, res) => {
  res.status(200).json(res.locals.result);
});

router.get('/openSchema', openSchema, (req, res) => {
  res.status(200).json({ ok: 'ok' });
});

router.post('/postSchema', postSchema, (req, res) => {
  res.status(200).json([
    {
      columnName: 'People',
      dataType: 'VARCHAR(200)',
      isPrimaryKey: false,
      isForeignKey: false,
    },
    {
      columnName: 'City',
      dataType: 'VARCHAR(200)',
      isPrimaryKey: false,
      isForeignKey: false,
    },
    {
      columnName: 'Job',
      dataType: 'VARCHAR(200)',
      isPrimaryKey: false,
      isForeignKey: false,
    },
  ]);
});

// Receiving an array of strings (queries)
router.post('/handleQueries', handleQueries, (req, res) => {
  res.status(200).json({ success: res.locals.success });
});

router.post('/saveSchema', saveSchema, (req, res) => {
  res.status(200).send('Save successful!');
});

router.post('/deleteSchema', deleteSchema, (req, res) => {
  res.status(200).send('Delete successful!');
});

// New route for getting log info
router.post('/getLogs', getLogInfo, (req, res) => {
  res.status(200).json(res.locals.logTable);
});

router.post('/setLogs', setLogInfo, (req, res) => {
  return res.status(200);
});

export { router };
