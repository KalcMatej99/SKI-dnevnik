var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('teams');
});

module.exports = router;