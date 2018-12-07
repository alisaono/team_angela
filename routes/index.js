var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team Angela' });
});

/* GET region map. */
router.get('/region_map', function(req, res, next) {
  res.render('region_map');
});

/* GET marker map. */
router.get('/marker_map', function(req, res, next) {
  res.render('marker_map');
});

/* GET gesture recording map. */
router.get('/record_gesture', function(req, res, next) {
  res.render('record_gesture');
});

/* GET map with state highlighted. */
router.get('/highlight_state/:state', function(req, res, next) {
  res.render('highlight_state', { state: req.params.state });
});

module.exports = router;
