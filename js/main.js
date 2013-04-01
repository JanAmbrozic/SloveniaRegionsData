var map = L.map('map').setView([46.151241, 14.995463], 9);

		L.tileLayer('http://{s}.tile.cloudmade.com/ee24b382df8040c4867a605bdc6c54a2/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);

		var circle = L.circle([46.151241, 14.995463], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);

L.geoJson(sloveniaRegionsData[0].geojson).addTo(map);
L.geoJson(sloveniaRegionsData[1].geojson).addTo(map);
//gorenjska
L.geoJson(sloveniaRegionsData[2].geojson).addTo(map);
