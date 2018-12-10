function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [
    v[0] + t * (w[0] - v[0]),
    v[1] + t * (w[1] - v[1])
  ]);
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
let convexHull = new function() {
  // Returns a new array of points representing the convex hull of
  // the given set of points. The convex hull excludes collinear points.
  // This algorithm runs in O(n log n) time.
  this.makeHull = function (points) {
    var newPoints = points.slice();
    newPoints.sort(this.POINT_COMPARATOR);
    return this.makeHullPresorted(newPoints);
  };


  // Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
  this.makeHullPresorted = function (points) {
    if (points.length <= 1)
      return points.slice();

    // Andrew's monotone chain algorithm. Positive y coordinates correspond to "up"
    // as per the mathematical convention, instead of "down" as per the computer
    // graphics convention. This doesn't affect the correctness of the result.

    var upperHull = [];
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      while (upperHull.length >= 2) {
        var q = upperHull[upperHull.length - 1];
        var r = upperHull[upperHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
          upperHull.pop();
        else
          break;
      }
      upperHull.push(p);
    }
    upperHull.pop();

    var lowerHull = [];
    for (var i = points.length - 1; i >= 0; i--) {
      var p = points[i];
      while (lowerHull.length >= 2) {
        var q = lowerHull[lowerHull.length - 1];
        var r = lowerHull[lowerHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
          lowerHull.pop();
        else
          break;
      }
      lowerHull.push(p);
    }
    lowerHull.pop();

    if (upperHull.length == 1 && lowerHull.length == 1 && upperHull[0].x == lowerHull[0].x && upperHull[0].y == lowerHull[0].y)
      return upperHull;
    else
      return upperHull.concat(lowerHull);
  };

  this.POINT_COMPARATOR = function (a, b) {
    if (a.x < b.x)
      return -1;
    else if (a.x > b.x)
      return +1;
    else if (a.y < b.y)
      return -1;
    else if (a.y > b.y)
      return +1;
    else
      return 0;
  };
};
function ptInPoly(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point.x, y = point.y;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function saveRegionHulls() {
  let chulls = []
  for (let a = 0; a < 50; a++) {
    let normPts = []
    for (let b = 0; b < regionPts[a].length; b++) {
      normPts.push({ x: regionPts[a][b][0], y: regionPts[a][b][1] })
    }
    chulls.push(convexHull.makeHull(normPts))
  }
  let a = document.createElement('a')
  let file = new Blob([JSON.stringify(chulls)], { type: 'application/json' })
  a.href = URL.createObjectURL(file)
  a.download = 'gestures.json'
  a.click()
  a.remove()
}