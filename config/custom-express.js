var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var morgan = require('morgan');
var logger = require('../services/logger.js');

module.exports = function() {
  var app = express();

  app.use(morgan('common', {
    stream: {
      write: function(msg) {
        logger.info(msg);
      }
    }
  }));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(validator());

  consign()
    .include('controllers')
    .then('persistence')
    .then('services')
    .into(app);

  return app;
}
