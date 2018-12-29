// Creating map object (Cairo, Egypt)
var map = L.map("map", {
  center: [30.0626, 31.2497],
  zoom: 2
});

// Create the tile layer that will be the background of our map
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

$.getJSON("countries2.geojson", function(data) {
    L.geoJson(data).addTo(map);
    console.log(data);
});
  //   var heatArray = [];

  // for (var i = 0; i < data.length; i++) {
  //   var location = data[i].location;

  //   if (location) {
  //     heatArray.push([location.coordinates[1], location.coordinates[0]]);
  //   }
  // }

  // var heat = L.heatLayer(heatArray, {
  //   radius: 20,
  //   blur: 35
 




// Function to determine marker size based on water accessibility
// function markerSize(accesslevel) {
//   return access / 5;
// }

// // An array containing all of the information needed to create city and state markers
// var locations = []
  
// // Define arrays to hold created city and state markers
// var countryMarkers = [];
// var accessMarkers = [];
// var qualityMarkers = [];

// // Loop through locations and create water access and quality markers
// for (var i = 0; i < locations.length; i++) {
//   // Setting the marker radius for the state by passing population into the markerSize function
//   countryMarkers.push(
//     L.circle(locations[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "white",
//       radius: markerSize(locations[i].state.population)
//     })
//   );
//   // Setting the marker radius for the country by passing population into the markerSize function
//   accessMarkers.push(
//     L.circle(geometry[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "purple",
//       fillColor: "purple",
//       radius: markerSize(geometry[i].coordinates
//     })
//   );
//   // Setting the marker radius for the city by passing population into the markerSize function
//   qualityMarkers.push(
//     L.circle(locations[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "purple",
//       fillColor: "purple",
//       radius: markerSize(locations[i].city.population)
//     })
//   );
// }

// // Create two separate layer groups: one for water access and one for water quality
// var access = L.layerGroup(accessMarkers);
// var quality = L.layerGroup(qualityMarkers);

// // Create a baseMaps object
// var baseMaps = {
//   "Street Map": streetmap,
// };

// // Create an overlay object
// var overlayMaps = {
//   "Water Access": access,
//   "Water Quality": quality
// };

// // Define a map object
// var map = L.map("map", {
//   center: [30.0626, 31.2497],
//   zoom: 2
//   layers: [streetmap, access, quality]
// });

// // Pass our map layers into our layer control
// / Add the layer control to the map
// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(map);
