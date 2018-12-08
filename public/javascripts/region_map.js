let stateNames = {} // abbreviation to name
let incomeData = []
let selections = new Set()

google.charts.load('current', {
  packages:['geochart'],
  mapsApiKey: 'AIzaSyAjtJGdq1tPS1DfKqylSSuHii6VvIDGxsU', // TODO: domain restrict API access
  callback: function() {
    loadIncomes()
  }
})

function loadIncomes() {
  $.getJSON("/api/income/states",function(data) {
    for (let row of data.rows) {
      stateNames[`US-${row.abbreviation}`] = row.name
      incomeData.push([
        // v is the value, f is the content of tooltip.
        {v: `US-${row.abbreviation}`, f: row.name},
        row.income
      ])
    }
    updateMap()
  })
}

function updateMap() {
  let dataArray = [['State', 'Income']] // data header
  for (let d of incomeData) {
    if (!selections.has(d[0]['v'])) {
      dataArray.push(d)
    }
  }
  let dataTable = google.visualization.arrayToDataTable(dataArray)
  let formatter = new google.visualization.NumberFormat({prefix: '$', fractionDigits: 0})
  formatter.format(dataTable, 1)
  drawRegionMap(dataTable, 'state_incomes_map')
}

function drawRegionMap(dataTable, divID) {
  let options = {
    region: 'US',
    resolution: 'provinces',
    datalessRegionColor: '#888'
  }
  let chart = new google.visualization.GeoChart(document.getElementById(divID))
  chart.draw(dataTable, options)
  google.visualization.events.addListener(chart, 'regionClick', function(data) {
    if (selections.has(data.region)) {
      selections.delete(data.region)
      $(`#selected_list > li.${data.region}`).remove()
    } else {
      selections.add(data.region)
      $('#selected_list').append(`<li class="${data.region}"> ${stateNames[data.region]}</li>`)
    }
    updateMap()
  })
}
