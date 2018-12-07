let mapWidth = 0 // to be calculated
let mapHeight = 0 // to be calculated

let dragStart = 0 // timestamp (ms)
let dragCoords = [] // list of [x (normalized), y (normalized), time elapsed (ms)]

let states = [['MA', 'NY'], ['CA', 'OR', 'WA']]
let statesIdx = 0 // index of currently selected states
let data = [] // list of [selected states, dragCoords]

google.charts.load('current', {
  packages:['geochart'],
  mapsApiKey: 'AIzaSyAjtJGdq1tPS1DfKqylSSuHii6VvIDGxsU', // TODO: domain restrict API access
  callback: function() {
    drawMap(states[statesIdx])
    mapWidth = document.getElementById('map').offsetWidth
    mapHeight = document.getElementById('map').offsetHeight
    document.addEventListener('mousedown', onMouseDown)
  }
})

function drawMap(selectedStates) {
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
  dragStart = Date.now()
  dragCoords = []
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(event) {
  dragCoords.push([event.pageX / mapWidth, event.pageY / mapHeight, Date.now() - dragStart])
}

function onMouseUp(event) {
  showDragCoords()
  saveDragCoords()
  document.removeEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function showDragCoords() {
  // console.log(dragCoords)
  let canvas = document.getElementById('trace')
  if (canvas.getContext) {
    let ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(dragCoords[0][0] * mapWidth, dragCoords[0][1] * mapHeight)
    for (let i = 1; i < dragCoords.length; i++) {
      ctx.lineTo(dragCoords[i][0] * mapWidth, dragCoords[i][1] * mapHeight)
    }
    ctx.stroke()
  }
}

function saveDragCoords() {
  // console.log(data)
  data.push([[states[statesIdx], dragCoords]])
  statesIdx = (statesIdx + 1) % states.length
  drawMap(states[statesIdx])
}
