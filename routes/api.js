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

/* GET income by states. */
router.get('/income/states', function(req, res, next) {
  knex.select().from('state_incomes').join('states', 'state_incomes.id', 'states.id')
    .then(function(data) {
      res.json({ rows: data });
    })
    .catch(function(err) {
      res.json({ rows: [] });
    });
});

/* GET population by states. */
router.get('/population/states', function(req, res, next) {
  knex.select().from('state_populations').join('states', 'state_populations.id', 'states.id')
    .then(function(data) {
      res.json({ rows: data });
    })
    .catch(function(err) {
      res.json({ rows: [] });
    });
});

/* GET average monthly temperatures. */
router.get('/temperatures', function(req, res, next) {
  knex.select().from('temperatures').join('weather_stations', 'temperatures.id', 'weather_stations.id')
    .then(function(data) {
      res.json({ rows: data });
    })
    .catch(function(err) {
      res.json({ rows: [] });
    });
});

module.exports = router;
