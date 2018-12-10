let stateIDs = ["AK","AL","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]
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

let stateIncomes = {}
let minIncome = Infinity
let maxIncome = -Infinity

let minColor = [160, 160, 160] //rgb
let maxColor = [0, 0, 0] //rgb
let toSelectColor = '#888'
let selectedColor = '#27ae60'
let defaultColor = '#eee'
let stateColors = {}

let mapWidth = 0 // to be calculated
let mapHeight = 0 // to be calculated

let toSelect = ['CA', 'OR', 'WA']
let selections = new Set()

let selectTimer = null
let startSelect = 0 // to be set when first mouse click happens
let endSelect = 0 // to be set when 'toSelect' states are selected
let mouseClicks = []

$(document).ready(function() {
  // loadIncomes()
  mapWidth = document.getElementById('map').offsetWidth
  mapHeight = document.getElementById('map').offsetHeight
  $('#map').addClass('clickable')
  colorThese(toSelect, toSelectColor, defaultColor)
  initMap()
  initPane()
})

function loadIncomes() {
  $.getJSON('/api/income/states',function(data) {
    for (let row of data.rows) {
      stateIncomes[row.abbreviation] = row.income
      minIncome = Math.min(minIncome, row.income)
      maxIncome = Math.max(maxIncome, row.income)
    }
    colorByIncome()
  })
}

function initPane() {
  for (let s of toSelect) {
    $('#to_select_list').append(`<li class="${s}"> ${stateNames[s]}</li>`)
  }
  $('#map svg').on('click', 'path', detectFirstClick)
}

function detectFirstClick(event) { // start timer
  mouseClicks.push([event.originalEvent.pageX / mapWidth, event.originalEvent.pageY / mapHeight, 0])
  startSelect = Date.now()
  selectTimer = setInterval(function() {
    let elapsed = (Date.now() - startSelect) / 1000
    $('#timer').text(`${elapsed.toFixed(1)}s`)
  }, 100)
  $('#map svg').off('click', 'path', detectFirstClick)
  document.addEventListener('click', recordClick)
}

function recordClick(event) {
  mouseClicks.push([event.pageX / mapWidth, event.pageY / mapHeight, Date.now() - startSelect])
}

function initMap() {
  $('#map svg').find('path').on('click',function(){
    let state = $(this).attr('class')
    if (selections.has(state)) {
      selections.delete(state)
      $(this).css({ fill: stateColors[$(this).attr('class')] })
      $(`#selected_list > li.${state}`).remove()
    } else {
      selections.add(state)
      $(this).css({ fill: selectedColor })
      $('#selected_list').append(`<li class="${state}"> ${stateNames[state]}</li>`)
    }
    if (selections.size === toSelect.length) {
      let diff = toSelect.filter(x => !selections.has(x))
      if (diff.length === 0) { // selection complete
        endSelect = Date.now()
        document.removeEventListener('click', recordClick)
        clearInterval(selectTimer) // stop timer
        console.log(mouseClicks)
      }
    }
  })
}

function colorThese(states, color, otherColor) {
  let statesSet = new Set(states)
  for (let id of stateIDs) {
    stateColors[id] = statesSet.has(id) ? color : otherColor
  }
  $('#map svg').find('path').each(function(){
    $(this).css({ fill: stateColors[$(this).attr('class')] })
  })
}

function colorByIncome() {
  for (let s of Object.entries(stateIncomes)) {
    let coeff = (s[1] - minIncome) / (maxIncome - minIncome)
    let rgb = []
    for (let i = 0; i < 3; i++) {
      rgb.push(minColor[i] + (maxColor[i] - minColor[i]) * coeff)
    }
    stateColors[s[0]] = rgb
  }

  $('#map svg').find('path').each(function(){
    let rgb = stateColors[$(this).attr('class')]
    $(this).css({ fill: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`})
  })
}
