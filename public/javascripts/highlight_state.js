google.charts.load('current', {
  packages:['geochart'],
  mapsApiKey: 'AIzaSyAjtJGdq1tPS1DfKqylSSuHii6VvIDGxsU', // TODO: domain restrict API access
  callback: function() {
    drawMap()
  }
})

function drawMap() {
  let dataArray = [['State', 'Selected'], [stateToHighlight, 1]]
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
