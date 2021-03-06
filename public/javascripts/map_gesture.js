let stateIDs = ["AK", "AL", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
let stateNames = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
}

let toSelectColor = '#888'
let selectedColor = '#27ae60'
let defaultColor = '#eee'
let stateColors = {}

let mapWidth = 0 // to be calculated
let mapHeight = 0 // to be calculated

let toSelects = [
  ['CA', 'OR', 'WA'],
  ['MA', 'RI', 'CT', 'NY'],
  ['SD', 'NE', 'KS', 'OK'],
  ['SD', 'NE', 'KS', 'OK', 'TX', 'NM', 'CO', 'WY', 'MT'],
  ['ID', 'WY', 'UT', 'CO', 'NM', 'AZ', 'NV']
]
let toSelect = toSelects[toSelectIdx]
let selections = new Set()

let selectTimer = null
let dragStart = 0 // timestamp (ms)
let dragEnd = 0 // timestamp (ms)
let dragCoords = [] // list of [x (normalized), y (normalized), time elapsed (ms)]

let body = document.body, html = document.documentElement
let margin = 0

let data = []
document.onkeyup = function (event) {
  if (event.code === 'KeyD') {
    console.log(data)

    // also save data to a local json
    let a = document.createElement('a')
    let file = new Blob([JSON.stringify(data)], { type: 'application/json' })
    a.href = URL.createObjectURL(file)
    a.download = `${gestureType}.json`
    a.click()
    a.remove()
  }
}

$(document).ready(function () {
  colorThese(toSelect, toSelectColor, defaultColor)
  initDimens()
  initPane()
  document.addEventListener('mousedown', onMouseDown)
})

function initDimens() {
  mapWidth = document.getElementById('map').offsetWidth
  mapHeight = document.getElementById('map').offsetHeight
  document.getElementById('trace').width = mapWidth
  document.getElementById('trace').height = mapHeight

  let height = html.clientHeight
  margin = (height - mapHeight) / 2
  document.getElementById('map').style.marginTop = margin + 'px'
  document.getElementById('map').style.marginBottom = margin + 'px'
  document.getElementById('trace').style.marginTop = margin + 'px'
  document.getElementById('trace').style.marginBottom = margin + 'px'
}

function initPane() {
  for (let s of toSelect) {
    $('#to_select_list').append(`<li class="${s}"> ${stateNames[s]}</li>`)
  }
}

function colorThese(states, color, otherColor) {
  let statesSet = new Set(states)
  for (let id of stateIDs) {
    stateColors[id] = statesSet.has(id) ? color : otherColor
  }
  $('#map svg').find('path').each(function () {
    $(this).css({ fill: stateColors[$(this).attr('class')] })
  })
}

function onMouseDown(event) {
  selections.clear()
  $('#selected_list').empty()
  colorThese(toSelect, toSelectColor, defaultColor) // reset coloring
  hideDragCoords()
  dragStart = Date.now()
  dragCoords = []
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  selectTimer = setInterval(function () {
    let elapsed = (Date.now() - dragStart) / 1000
    $('#timer').text(`${elapsed.toFixed(1)}s`)
  }, 100)
}

function onMouseMove(event) {
  dragCoords.push([(event.pageX) / mapWidth, (event.pageY - margin) / mapHeight, Date.now() - dragStart])
  showDragCoords()
}

function onMouseUp(event) {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  showDragCoords()
  dragEnd = Date.now()
  clearInterval(selectTimer) // stop timer

  if (gestureType === 'stab') {
    analysis = stabbingGesture(dragCoords)
  } else if (gestureType === 'wrap_inclusive') {
    analysis = wrappingInclusiveGesture(dragCoords)
  } else if (gestureType === 'wrap_exclusive') {
    analysis = wrappingExclusiveGesture(dragCoords)
  } else { // hull inclusive
    analysis = hullInclusiveGesture(dragCoords)
  }

  for (let s of analysis[1]) { // selected states based on gesture
    $(`#map svg path.${s}`).css({ fill: selectedColor })
    $('#selected_list').append(`<li class="${s}"> ${stateNames[s]}</li>`)
  }
  data.push([analysis[0], analysis[1], toSelect])
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