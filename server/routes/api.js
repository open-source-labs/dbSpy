// Note: Perhaps use of params for this section would be useful, for instance 
// router.get('/getSchema/:id');

const express = require('express');
//const { module } = require('../../webpack.config');
const controller = require('../controllers/dataController');

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



router.get('/getAllSchemas', 
  controller.getAllSchemas,
  (req, res) => {
    
    res.status(200).json({'ok': 'ok'});
});

router.post('/getSchema', 
  controller.getSchema,
  (req, res) => {
    console.log("called");
    res.status(200).json(res.locals.data);
});

router.get('/openSchema',controller.openSchema,
  (req, res) => {
    res.status(200).json({'ok': 'ok'});
});

router.post('/postSchema', 
  controller.postSchema,
  (req, res) => {
    res.status(200).send('Post successful!');
});

router.post('/saveSchema', 
  controller.saveSchema,
  (req, res) => {
    res.status(200).send('Save successful!');
});

router.post('/deleteSchema', 
  controller.deleteSchema,
  (req, res) => {
    res.status(200).send('Delete successful!');
});



module.exports = router;