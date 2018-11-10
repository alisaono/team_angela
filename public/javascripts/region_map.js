google.charts.load('current', {
  packages:['geochart'],
  mapsApiKey: 'AIzaSyAjtJGdq1tPS1DfKqylSSuHii6VvIDGxsU', // TODO: domain restrict API access
  callback: function() {
    drawStateIncomes('state_incomes_map')
    drawStatePopulations('state_populations_map')
  }
})

function drawStateIncomes(divID) {
  $.getJSON("/api/income/states",function(data) {
    let dataArray = [['State', 'Income']] // data header
    for (let row of data.rows) {
      dataArray.push([
        // v is the value, f is the content of tooltip.
        {v: `US-${row.abbreviation}`, f: row.name},
        row.income
      ])
    }

    let dataTable = google.visualization.arrayToDataTable(dataArray)
    let formatter = new google.visualization.NumberFormat({prefix: '$', fractionDigits: 0})
    formatter.format(dataTable, 1)

    drawRegionMap(dataTable, divID)
  })
}

function drawStatePopulations(divID) {
  $.getJSON("/api/population/states",function(data) {
    let dataArray = [['State', 'Population']] // data header
    for (let row of data.rows) {
      dataArray.push([
        // v is the value, f is the content of tooltip.
        {v: `US-${row.abbreviation}`, f: row.name},
        // value == content of tooltip for row.population
        row.population
      ])
    }
    let dataTable = google.visualization.arrayToDataTable(dataArray)
    drawRegionMap(dataTable, divID)
  })
}

function drawRegionMap(dataTable, divID) {
  let options = {
    region: 'US',
    resolution: 'provinces',
  }
  let chart = new google.visualization.GeoChart(document.getElementById(divID))
  chart.draw(dataTable, options)
}
