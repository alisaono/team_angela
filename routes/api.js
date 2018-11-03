var express = require('express');
var router = express.Router();

var config = require('../config.js');
var knex = require('knex')({
  client: 'mysql',
  connection: config.sql_connection
});

/* GET all data from table with id. */
router.get('/table/:id', function(req, res, next) {
  knex.select().from(req.params.id)
    .then(function(data) {
      res.json({ rows: data });
    })
    .catch(function(err) {
      res.json({ rows: [] });
    });
});

module.exports = router;
