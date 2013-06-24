//Declare global variables
var map;
var popup;


//PanInsideBounds Fix
L.Map.include({
    panInsideBounds: function(bounds) {
        bounds = L.latLngBounds(bounds);

        var viewBounds = this.getBounds(),
            viewSw = this.project(viewBounds.getSouthWest()),
            viewNe = this.project(viewBounds.getNorthEast()),
            sw = this.project(bounds.getSouthWest()),
            ne = this.project(bounds.getNorthEast()),
            dx = 0,
            dy = 0;

        if (viewNe.y < ne.y) { // north
            dy = ne.y - viewNe.y + Math.max(0, this.latLngToContainerPoint([85.05112878, 0]).y); // + extra vertical scroll
        }
        if (viewNe.x > ne.x) { // east
            dx = ne.x - viewNe.x;
        }
        if (viewSw.y > sw.y) { // south
            dy = sw.y - viewSw.y + Math.min(0, this.latLngToContainerPoint([-85.05112878, 0]).y - this.getSize().y); // + extra vertical scroll
        }
        if (viewSw.x < sw.x) { // west
            dx = sw.x - viewSw.x;
        }

        return this.panBy(new L.Point(dx, dy, true));
    }
});


//Setup Map
map = L.map('map', {
	maxZoom: 6
}).setView([0, 0], 2);
L.tileLayer('tiles/map2/{z}/{x}/{y}.png', {}).addTo(map);


map.setMaxBounds([

	[-85, -180.0],
	[85, 180.0]
]);


var nullStyle = {
	"color": "#888",
	"weight": 0,
	"fillOpacity": 0,
	"opacity": 0
};

//Popup for each country
function onEachCountry(feature, layer) {
	var popupContent = "<div class='test'><strong>" + feature.properties.iso_a3;
	//layer.bindPopup(popupContent);
    layer.on('click', function(e){
        console.log(e)
    })
}

//On click of the country.  Right now just writes the iso_a3 property to the console
function onCountryClick(e) {
	console.log(e.layer.feature.properties.iso_a3);
}

//Loads geoJSON file containing country boundaries
$.getJSON('js/countries.geojson', function(data) {
	countries = L.geoJson(data, {
		style: nullStyle,
		onEachFeature: onEachCountry
	}).addTo(map)
		.on('click', function(e) {
		onCountryClick(e);
	});
});
