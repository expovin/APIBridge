'use strict';

var express = require('express');
var router = express.Router();
var CircularJSON = require('circular-json')





/* GET users listing. */
router.get('/', function(req, res, next) {

  var str = CircularJSON.stringify(res);
  res.json(JSON.parse(str));
});

module.exports = router;
