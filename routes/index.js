var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team Angela' });
});

/* GET heat map. */
router.get('/heat_map', function(req, res, next) {
  res.render('heat_map');
});

/* GET heat map. */
router.get('/topo_map', function(req, res, next) {
  res.render('topo_map');
});

module.exports = router;
