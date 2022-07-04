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
  // controller.getSchema,
  (req, res) => {
    console.log("called");
    
    const dummydata =  [
      {
        Name: 'public.accounts',
        Properties: [
          {
            IsForeignKey: false,
            IsPrimaryKey: false,
            Name: 'user_id integer NOT NULL',
            References: [],
            TableName: 'public.accounts',
            Value: null,
            additional_constraints: 'NOT NULL',
            data_type: 'integer',
            field_name: 'user_id',
          },
        ]
      },
      {
        Name: 'public.location',
        Properties: [
          {
            IsForeignKey: false,
            IsPrimaryKey: false,
            Name: 'id integer NOT NULL',
            References: [],
            TableName: 'public.location',
            Value: null,
            additional_constraints: 'NOT NULL',
            data_type: 'integer',
            field_name: 'id',
          },
          {
            IsForeignKey: false,
            IsPrimaryKey: false,
            Name: "password character varying(50) NOT NULL",
            References: [],
            TableName: "public.accounts",
            Value: null,
            additional_constraints: "NOT NULL",
            data_type: "character varying(50)",
            field_name: "password",
          },
          {
            IsForeignKey: false,
            IsPrimaryKey: false,
            Name: "email character varying(255) NOT NULL",
            References: [],
            TableName: "public.accounts",
            Value: null,
            additional_constraints: "NOT NULL",
            data_type: "character varying(255)",
            field_name: "email",
          },
        ]
      }
    ];






    // res.status(200).json(res.locals.data);
    console.log('returned', dummydata);
     res.status(200).json(dummydata);
});

router.get('/testObj', controller.objSchema, (req, res) => {
 res.status(200).json({'response': res.locals.result});
});

router.get('/openSchema',controller.openSchema,
  (req, res) => {
    res.status(200).json({'ok': 'ok'});
});

router.post('/postSchema', 
  controller.postSchema,
  (req, res) => {
    console.log("About to send Post!");
    res.status(200).json([{columnName: "People", dataType: "VARCHAR(200)", isPrimaryKey: false, isForeignKey: false}, {columnName: "City", dataType: "VARCHAR(200)", isPrimaryKey: false, isForeignKey: false}, {columnName: "Job", dataType: "VARCHAR(200)", isPrimaryKey: false, isForeignKey: false}]);
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