var express = require('express');
var router = express.Router();
var handle = require('../handle.js')
/* GET home page. */
router.get('/', (req, res, next) => {
  handle.handleRequest(req, res);
});

/** Process POST request */
router.post('/', function (req, res, next) {
  handle.handleRequest(req, res);
});

module.exports = router;
