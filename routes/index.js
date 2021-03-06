var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team Angela' });
});

/* GET map for point-and-click selection */
router.get('/click/:id', function(req, res, next) {
  res.render('region_map', { map_script: 'map_click', map_type: 'click', select_id: req.params.id });
});

/* GET map for stabbing selection */
router.get('/stab/:id', function(req, res, next) {
  res.render('region_map', { map_script: 'map_gesture', map_type: 'stab', select_id: req.params.id });
});

/* GET region map. */
router.get('/wrap_inclusive/:id', function(req, res, next) {
  res.render('region_map', { map_script: 'map_gesture', map_type: 'wrap_inclusive', select_id: req.params.id });
});

/* GET region map. */
router.get('/wrap_exclusive/:id', function(req, res, next) {
  res.render('region_map', { map_script: 'map_gesture', map_type: 'wrap_exclusive', select_id: req.params.id });
});

/* GET region map. */
router.get('/hull/:id', function(req, res, next) {
  res.render('region_map', { map_script: 'map_gesture', map_type: 'hull', select_id: req.params.id });
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
