const metroLineOrders = {
  "Red": ["Shady Grove", "Twinbrook", "Rockville", "North Bethesda", "Grosvenor-Strathmore", "Medical Center", "Bethesda", "Friendship Heights", "Tenleytown-AU", "Van Ness-UDC", "Cleveland Park", "Woodley Park", "Dupont Circle", "Farragut North", "Metro Center", "Gallery Place", "Judiciary Square", "Union Station", "NoMa-Gallaudet U", "Rhode Island Ave", "Brookland-CUA", "Fort Totten", "Takoma", "Silver Spring", "Forest Glen", "Wheaton", "Glenmont"],
  "Blue": ["Franconia-Springfield", "Van Dorn Street", "King St-Old Town", "Braddock Road", "Potomac Yard", "Ronald Reagan Washington National Airport", "Crystal City", "Pentagon City", "Pentagon", "Arlington Cemetery", "Rosslyn", "Foggy Bottom-GWU", "Farragut West", "McPherson Square", "Metro Center", "Federal Triangle", "Smithsonian", "L'Enfant Plaza", "Federal Center SW", "Capitol South", "Eastern Market", "Potomac Ave", "Stadium-Armory", "Benning Road", "Capitol Heights", "Addison Road", "Morgan Boulevard", "Downtown Largo"],
  "Orange": ["Vienna", "Dunn Loring", "West Falls Church", "East Falls Church", "Ballston-MU", "Virginia Square-GMU", "Clarendon", "Court House", "Rosslyn", "Foggy Bottom-GWU", "Farragut West", "McPherson Square", "Metro Center", "Federal Triangle", "Smithsonian", "L'Enfant Plaza", "Federal Center SW", "Capitol South", "Eastern Market", "Potomac Ave", "Stadium-Armory", "Minnesota Ave", "Deanwood", "Cheverly", "Landover", "New Carrollton"],
  "Green": ["Branch Ave", "Suitland", "Naylor Road", "Southern Ave", "Congress Heights", "Anacostia", "Navy Yard-Ballpark", "Waterfront", "L'Enfant Plaza", "Archives", "Gallery Place", "Mt Vernon Sq", "Shaw-Howard U", "U Street", "Columbia Heights", "Georgia Ave-Petworth", "Fort Totten", "West Hyattsville", "Hyattsville Crossing", "College Park-U of Md", "Greenbelt"],
  "Yellow": ["Huntington", "Eisenhower Ave", "King St-Old Town", "Braddock Road", "Potomac Yard", "Ronald Reagan Washington National Airport", "Crystal City", "Pentagon City", "Pentagon", "L'Enfant Plaza", "Archives", "Gallery Place", "Mt Vernon Sq", "Shaw-Howard U", "U Street", "Columbia Heights", "Georgia Ave-Petworth", "Fort Totten", "West Hyattsville", "Hyattsville Crossing", "College Park-U of Md", "Greenbelt"],
  "Silver": ["Wiehle-Reston East", "Spring Hill", "Greensboro", "Tysons", "McLean", "East Falls Church", "Ballston-MU", "Virginia Square-GMU", "Clarendon", "Court House", "Rosslyn", "Foggy Bottom-GWU", "Farragut West", "McPherson Square", "Metro Center", "Federal Triangle", "Smithsonian", "L'Enfant Plaza", "Federal Center SW", "Capitol South", "Eastern Market", "Potomac Ave", "Stadium-Armory"]
};

function getNeighboringStations(station, line) {
  const lineArray = metroLineOrders[line];
  
  if (!lineArray) {console.log("Line not found."); return [];}
  
  const index = lineArray.indexOf(station);
  if (index === -1) {console.log("Station not found on this line."); return [];}

  let neighbors = [];

  // Standard neighbors (Previous and Next in the array)
  if (index > 0) neighbors.push(lineArray[index - 1]);
  if (index < lineArray.length - 1) neighbors.push(lineArray[index + 1]);

  // Special Case: Silver Line split at Stadium-Armory
  // In reality, Silver line trains alternate destinations (Largo or New Carrollton)
  if (line === "Silver" && station === "Stadium-Armory") {
    neighbors.push("Benning Road"); // Heading toward Largo
    neighbors.push("Minnesota Ave"); // Heading toward New Carrollton
  }

  return neighbors;
}

/**
 * Determines the final destination based on the current line and direction of travel.
 * @param {string} line - The Metro line color (e.g., "Red", "Silver").
 * @param {string} currentStop - The station the user is currently at.
 * @param {string} nextStop - The station the train is moving toward.
 * @returns {string} The name of the final terminus station.
 */
function getDestination(line, currentStop, nextStop) {
  const lineArray = metroLineOrders[line];
  if (!lineArray) return "Line not found.";

  // Special Case: Silver Line Split logic
  if (line === "Silver" && currentStop === "Stadium-Armory") {
    if (nextStop === "Benning Road") return "Downtown Largo";
    if (nextStop === "Minnesota Ave") return "New Carrollton";
  }

  const currentIndex = lineArray.indexOf(currentStop);
  const nextIndex = lineArray.indexOf(nextStop);

  if (currentIndex === -1 || nextIndex === -1) {
    return "One or both stations not found on this line.";
  }

  // If nextIndex > currentIndex, we are moving toward the end of the array
  if (nextIndex > currentIndex) {
    return lineArray[lineArray.length - 1];
  } 
  // If nextIndex < currentIndex, we are moving toward the start of the array
  else {
    return lineArray[0];
  }
}

function doesLineServeStation(station, line) {
  return metroLineOrders[line].indexOf(station) === -1 ? false : true;
}

function changeNearby(stationList) {
    nearbyStationBox.replaceChildren();
    console.log(stationList);
    stationList.forEach(element => {
        var i = document.createElement("option");
        i.innerText = element;
        nearbyStationBox.appendChild(i);
    });
    nearbySelected = nearbyStationBox.value;
}

function PlayAudio() {
  playerOfAudio.PlayAudio(stationSelected, lineSelected, getDestination(lineSelected, stationSelected, nearbySelected), typeBox, nearbySelected);
  //var test = new Audio("/resc/audio/Chimes/DoorChime.wav");
  //test.play();
}

const playerOfAudio = new AudioPlayer;
const nearbyStationBox = document.getElementById("NearbyBox");
const doesServiceChecker = document.getElementById("StationChecker");
const stationSelect = document.getElementById("SelectStation");
const lineSelect = document.getElementById("SelectLine");
const audioTypeBox = document.getElementById("TypeBox");

let stationSelected = stationSelect.value;
let lineSelected = lineSelect.value;
let nearbySelected = nearbyStationBox.value
let typeBox = audioTypeBox.value;

stationSelect.onchange = function(event) {
    console.log("Station changed to: " + event.target.value);
    stationSelected = event.target.value;
    doesServiceChecker.innerText = doesLineServeStation(stationSelected, lineSelected) ? "" : "This Line DOES NOT serve this station.";
    changeNearby(getNeighboringStations(stationSelected, lineSelected));
};

lineSelect.onchange = function(event) {
    console.log("Line changed to: " + event.target.value);
    lineSelected = event.target.value;
    doesServiceChecker.innerText = doesLineServeStation(stationSelected, lineSelected) ? "" : "This Line DOES NOT serve this station.";
    changeNearby(getNeighboringStations(stationSelected, lineSelected));
};

nearbyStationBox.onchange = function(event) {
  console.log("Nearby Station Changed To: " + event.target.value);
  nearbySelected = event.target.value;
}

audioTypeBox.onchange = function(event) {
  console.log("Audio Type Changed To: " + event.target.value);
  typeBox = event.target.value;
}


