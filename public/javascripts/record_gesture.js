let mapWidth = 0 // to be calculated
let mapHeight = 0 // to be calculated

let dragStart = 0 // timestamp (ms)
let dragCoords = [] // list of [x (normalized), y (normalized), time elapsed (ms)]

let states = [['MA', 'NY'], ['CA', 'OR', 'WA']]
let statesIdx = 0 // index of currently selected states
let data = [] // list of [selected states, dragCoords]

let body = document.body,
  html = document.documentElement
let margin = 0

window.onload = function () {
}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, {
    x: v[0] + t * (w[0] - v[0]),
    y: v[1] + t * (w[1] - v[1])
  });
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

document.onkeyup = function (event) {
  if (event.code === 'KeyD') {
    console.log(data)

    // also save data to a local json
    let a = document.createElement('a')
    let file = new Blob([JSON.stringify(data)], { type: 'application/json' })
    a.href = URL.createObjectURL(file)
    a.download = 'gestures.json'
    a.click()
    a.remove()
  }

  if (event.code === 'KeyA') {
    //analyze current gesture
    gesture = dragCoords
    intended = states[statesIdx]
    console.log('intended states:', intended)

    //analyze with each gesture model
    //region points in regionPts
    //stabbing
    stabbing = []
    console.log(gesture)
    console.log(regionPts[0])
    for (let a = 0; a < 50; a++) {
      for (let b = 0; b < regionPts[a].length; b++) {
        for (let c = 0; c < gesture.length - 1; c++) {
          //test if regionPts[a][b] is close enough to line segment gesture[c], gesture[c + 1]
          //console.log(regionPts[a][b])
          //console.log(distToSegment(regionPts[a][b], gesture[c], gesture[c + 1]))
        }
      }
    }
    console.log('stabbing analysis:', stabbing)
  }
}

google.charts.load('current', {
  packages: ['geochart'],
  mapsApiKey: 'AIzaSyAjtJGdq1tPS1DfKqylSSuHii6VvIDGxsU', // TODO: domain restrict API access
  callback: function () {
    drawMap()
    mapWidth = document.getElementById('map').offsetWidth
    mapHeight = document.getElementById('map').offsetHeight
    document.addEventListener('mousedown', onMouseDown)

    document.getElementById('trace').width = mapWidth
    document.getElementById('trace').height = mapHeight

    let height = html.clientHeight
    margin = (height - mapHeight) / 2
    document.getElementById('map').style.marginTop = margin + 'px'
    document.getElementById('map').style.marginBottom = margin + 'px'
    document.getElementById('trace').style.marginTop = margin + 'px'
    document.getElementById('trace').style.marginBottom = margin + 'px'
  }
})

function drawMap() {
  let selectedStates = states[statesIdx]
  let dataArray = [['State', 'Selected']] // data header
  for (let s of selectedStates) {
    dataArray.push([s, 1])
  }
  let dataTable = google.visualization.arrayToDataTable(dataArray)
  let options = {
    region: 'US',
    resolution: 'provinces',
    legend: 'none',
    tooltip: { trigger: 'none' },
    enableRegionInteractivity: false
  }
  let chart = new google.visualization.GeoChart(document.getElementById('map'))
  chart.draw(dataTable, options)
}

function onMouseDown(event) {
  hideDragCoords()
  dragStart = Date.now()
  dragCoords = []
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(event) {
  dragCoords.push([(event.pageX) / mapWidth, (event.pageY - margin) / mapHeight, Date.now() - dragStart])
  showDragCoords()
}

function onMouseUp(event) {
  document.removeEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('keyup', onSpaceTyped)
  showDragCoords()
}

function onSpaceTyped(event) {
  if (event.code === 'Space') {
    document.removeEventListener('keyup', onSpaceTyped)
    data.push([states[statesIdx], dragCoords])
    statesIdx = (statesIdx + 1) % states.length
    hideDragCoords()
    drawMap() // draw the next map
  }
}

function showDragCoords() {
  let canvas = document.getElementById('trace')
  if (canvas.getContext && dragCoords.length > 0) {
    let ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(dragCoords[0][0] * mapWidth, dragCoords[0][1] * mapHeight)
    for (let i = 1; i < dragCoords.length; i++) {
      ctx.lineTo(dragCoords[i][0] * mapWidth, dragCoords[i][1] * mapHeight)
    }
    ctx.stroke()
  }
}

function hideDragCoords() {
  let canvas = document.getElementById('trace')
  if (canvas.getContext) {
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}
