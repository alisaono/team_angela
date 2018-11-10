google.charts.load('current', {
  packages:['geochart'],
  mapsApiKey: 'AIzaSyAjtJGdq1tPS1DfKqylSSuHii6VvIDGxsU', // TODO: domain restrict API access
  callback: function() {
    drawTemperatures('temperatures_map', 1) // month = 1 i.e. January for now
  }
})

function drawTemperatures(divID, month) {
  $.getJSON("/api/temperatures",function(data) {
    let dataArray = [['Latitude', 'Longitude', 'Temperature']] // data header
    for (let row of data.rows) {
      dataArray.push([row.latitude, row.longitude, row[`m${month}`]])
    }
    let dataTable = google.visualization.arrayToDataTable(dataArray)
    drawMarkerMap(dataTable, divID)
  })
}

function drawMarkerMap(dataTable, divID) {
  let options = {
    region: 'US',
    resolution: 'provinces',
    displayMode: 'markers',
    sizeAxis: { minSize: 2, maxSize: 2 },
    colorAxis: { colors: ['blue', 'red'] }
  }
  let chart = new google.visualization.GeoChart(document.getElementById(divID))
  chart.draw(dataTable, options)
}
