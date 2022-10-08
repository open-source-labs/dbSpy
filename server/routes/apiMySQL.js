// Note: Perhaps use of params for this section would be useful, for instance
// router.get('/getSchema/:id');

const express = require('express');
const mySQLdataController = require('../controllers/mySQLdataController');
//Note: LogController is not yet built
//const LogController = require('../controllers/loggingController');

const { dummydata } = require('../dummy.ts');

const router = express.Router();

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

//Note: this endpoint is not currently being used //getAllSchemas controller not yet built
// router.get('/getAllSchemas', mySQLdataController.getAllSchemas, (req, res) => {
//   res.status(200).json({ ok: 'ok' });
// });

// router.get('/testDrop', mySQLdataController.testDrop, (req, res) => {
//   res.status(200).json(res.locals.testresponse);
// });

/*
router.post(
  '/getSchema',
  mySQLdataController.getSchema,
  mySQLdataController.objSchema,
*/
router.post('/getSchema', mySQLdataController.getSchema, (req, res) => {
  res.status(200).json(res.locals.result);
});

// router.get('/openSchema', mySQLdataController.openSchema, (req, res) => {
//   res.status(200).json({ ok: 'ok' });
// });

// router.post('/postSchema', mySQLdataController.postSchema, (req, res) => {
//   res.status(200).json([
//     {
//       columnName: 'People',
//       dataType: 'VARCHAR(200)',
//       isPrimaryKey: false,
//       isForeignKey: false,
//     },
//     {
//       columnName: 'City',
//       dataType: 'VARCHAR(200)',
//       isPrimaryKey: false,
//       isForeignKey: false,
//     },
//     {
//       columnName: 'Job',
//       dataType: 'VARCHAR(200)',
//       isPrimaryKey: false,
//       isForeignKey: false,
//     },
//   ]);
// });

// Recieving an array of strings (queries)
// router.post('/handleQueries', mySQLdataController.handleQueries, (req, res) => {
//   res.status(200).json({ success: res.locals.success });
// });

// router.post('/saveSchema', mySQLdataController.saveSchema, (req, res) => {
//   res.status(200).send('Save successful!');
// });

// router.post('/deleteSchema', mySQLdataController.deleteSchema, (req, res) => {
//   res.status(200).send('Delete successful!');
// });

// New route for getting log info
// router.post('/getLogs', LogController.getLogInfo, (req, res) => {
//   res.status(200).json(res.locals.logTable);
// });

// router.post('/setLogs', LogController.setLogInfo, (req, res) => {
//   return res.status(200);
// });

module.exports = router;
