const express = require('express');

const dataController = require('../controllers/dataController');

const router = express.Router();

router.get('/other', (req, res) => {
res.status(200).json({"other call": "ok"});
      //res.status(200).json(res.locals.records)
  }
);

router.get('/', dataController.getSchema,(req, res) => {
    res.status(200).json({"getSchema": "ok"});
  }
);



module.exports = router;