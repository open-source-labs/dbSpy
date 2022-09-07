// Note: Perhaps use of params for this section would be useful, for instance
// router.get('/getSchema/:id');

const express = require('express');
const controller = require('../controllers/dataController');
const LogController = require('../controllers/loggingController');

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

router.get('/getAllSchemas', controller.getAllSchemas, (req, res) => {
  res.status(200).json({ ok: 'ok' });
});

router.get('/testDrop', controller.testDrop, (req, res) => {
  res.status(200).json(res.locals.testresponse);
});

router.post(
  '/getSchema',
   controller.getSchema,
   controller.objSchema,
  (req, res) => {
    res.status(200).json(res.locals.result);
  }
);

router.get('/openSchema', controller.openSchema, (req, res) => {
  res.status(200).json({ ok: 'ok' });
});

router.post('/postSchema', controller.postSchema, (req, res) => {
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

// Recieving an array of strings (queries)
router.post('/handleQueries',
  controller.handleQueries,
  (req, res) => {
    res.status(200).json({ success: res.locals.success });
  });

router.post('/saveSchema', controller.saveSchema, (req, res) => {
  res.status(200).send('Save successful!');
});

router.post('/deleteSchema', controller.deleteSchema, (req, res) => {
  res.status(200).send('Delete successful!');
});

// New route for getting log info
router.post('/getLogs', LogController.getLogInfo, (req, res) => {
  res.status(200).json(res.locals.logTable);
});

router.post('/setLogs', LogController.setLogInfo, (req, res) => {
  return res.status(200);
});


module.exports = router;

