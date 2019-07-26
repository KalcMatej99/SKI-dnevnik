var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
