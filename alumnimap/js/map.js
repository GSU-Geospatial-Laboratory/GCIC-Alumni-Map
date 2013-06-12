//Declare global variables
var map;
var popup;
// var cmk = "315bfb243f9f4e8fb6adc193a7367eeb";


//Setup Map
map = L.map('map', {
	maxZoom:6
}).setView([0, 0], 2);
L.tileLayer('tiles/map2/{z}/{x}/{y}.png', {}).addTo(map);
// L.tileLayer('http://c.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png', {
// 	attribution: 'Map data &copy; 2011 OpenStreetMap contributors',
// 	key: cmk
// }).addTo(map);

map.setMaxBounds([
	[-180, -1800],
	[180, 1800]
]);


var nullStyle = {
	"color": "#888",
	"weight": 0,
	"fillOpacity": 0,
	"opacity": 0
};

//Popup for each country
// function onEachCountry(feature, layer) {
// 	var popupContent = feature.properties.iso_a3;
// 	layer.bindPopup(popupContent);
// }

//On click of the country.  Right now just writes the iso_a3 property to the console
// function onCountryClick(e) {
// 	console.log(e.layer.feature.properties.iso_a3);
// }


//Looks up country from OpenStreetMap Nominatim database web service.  Returns two letter country code
function lookupCountry(e) {
	var lat = e.latlng.lat
	var lng = e.latlng.lng
	while (lng > 180) {
		console.log('uh oh')
		lng = lng - 360
	}
	while (lng < -180) {
		lng = lng + 360
	}
	$.ajax({
		dataType: 'json',
		url: 'http://nominatim.openstreetmap.org/reverse?format=json&limit=1&lat=' + lat + '&lon=' + lng + '&zoom=10&addressdetails=1'

	}).done(function(data) {
		if (data.error) {
			console.log(data.error)
		} else {
			popup.setContent(data.address.country_code).openOn(map)
			console.log(data.address.country_code)
		}
	})
}

//Loads geoJSON file containing country boundaries
// $.getJSON('js/countries.geojson', function(data) {
// 	countries = L.geoJson(data, {
// 		style: nullStyle,
// 		onEachFeature: onEachCountry
// 	}).addTo(map)
// 		.on('click', function(e) {
// 		onCountryClick(e);
// 	});
// });

map.on('click', function(e) {
	lookupCountry(e)
	popup = L.popup()
		.setLatLng(e.latlng);
})