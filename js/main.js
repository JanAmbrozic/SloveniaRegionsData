//global map variable
var map = L.map('map').setView([46.151241, 14.995463], 9);

var sloveniaRegionMap = 
{
	arrayRegionsMapping : {0:"Zasavska", 1:"Goriška", 2:"Gorenjska", 3:"Obalno-kraška", 4:"Notranjsko-kraška", 5:"Osrednjeslovenska",6:"Jugovzhodna",7:"Spodnjeposavska", 8:"Savinjska", 9:"Koroška", 10:"Podravska", 11:"Pomurska"},
	defaultPropery : null,
	regions : [],
	//default random colorScale
	colorScale : [0,10,20,30,50,80,130],

	/*
	init() initializes tileLayer with help of cloudmade.com. Should always be called before doing anything else.
	*/
	init: function() 
	{
		L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
			key: "ee24b382df8040c4867a605bdc6c54a2",
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			styleId: 22677
		}).addTo(map);

		this.addRegionsPolygons();
	},

	/*
	addRegionsPolygons() adds polygons of Slovenia regions on the map. It also register the listener for mouseOver.
	*/
	addRegionsPolygons: function() 
	{

		for (var i = sloveniaRegionsData.length - 1; i >= 0; i--) 
		{
			//we use mapping so we can connect geoJSON region data and statistical data. 
			//TODO change mapping to array so we can remove toString() method
			var regionName = this.arrayRegionsMapping[i.toString()];
			//we add statistical data to the actual geojson object because we will need it later
			sloveniaRegionsData[i].geojson.statsData = statsData[regionName]
			this.regions[i] = L.geoJson(sloveniaRegionsData[i].geojson, {
				style: sloveniaRegionMap.style(statsData[regionName]),
				onEachFeature: sloveniaRegionMap.hoverCallback
			}).addTo(map);
		};
	},

	/*
	addSettings() adds settings radio form so we can choose parameter for map coloring
	*/
	addSettings: function() 
	{
		for (var key in statsData["Pomurska"]) {
			if (statsData["Pomurska"].hasOwnProperty(key)) {
				//we set first property as the default propery. Should be changed to something smarter :)
				if(this.defaultPropery===null)
				{
					$('<label class="radio"><input type="radio" name="radio" value="'+key+'" checked />'+key+'</label>').appendTo('form#settings');
					this.defaultPropery = key;
				}
				else
				{
					$('<label class="radio"><input type="radio" name="radio" value="'+key+'" />'+key+'</label>').appendTo('form#settings');
				}
			}
		}
	},

	/*
	checkboxesChange() is called when radio checkbox is changed
	*/
	checkboxesChange: function(radioObject)
	{
		this.defaultPropery = $(radioObject).val()

		//we calculate new values for color scale so that map can be colored appropriately
		this.colorScale = utils.verySimpleScaleCalculation(utils.findMin(this.defaultPropery), utils.findMax(this.defaultPropery), 7);
		console.log("colorScale:");
		console.log(this.colorScale);
		
		for (var i = this.regions.length - 1; i >= 0; i--) {
			var regionName = this.arrayRegionsMapping[i.toString()];
			this.regions[i].setStyle(this.style(statsData[regionName]));
		};

	},

	/*
	onEachFeature() register listeners for mouseover and mouseout
	*/
	hoverCallback: function(feature, layer) 
	{
		layer.on({
			mouseover: sloveniaRegionMap.highlightFeature,
			mouseout: sloveniaRegionMap.resetHighlight,
		});
	},

	/*
	getColor() returns color based on values in colorScale
	*/
	getColor: function(d) {
    return d > this.colorScale[6] ? '#9E0142' :
           d > this.colorScale[5] ? '#D53E4F' :
           d > this.colorScale[4] ? '#F46D43' :
           d > this.colorScale[3] ? '#FDAE61' :
           d > this.colorScale[2] ? '#ABDDA4' :
           d > this.colorScale[1] ? '#66C2A5' :
           d > this.colorScale[0] ? '#3288BD' :
                     		   '#5E4FA2';
	},

	/*
	style() returns style and is used for polygon styling
	*/
	style: function(feature) {
	    return {
	        fillColor: this.getColor(feature[this.defaultPropery]),
	        weight: 2,
	        opacity: 1,
	        color: 'white',
	        dashArray: '3',
	        fillOpacity: 0.7
	    };
	},

	/*
	resetHighlight() resets style back to default on mouseOut
	*/
	resetHighlight: function(e) 
	{
		for (var i = sloveniaRegionMap.regions.length - 1; i >= 0; i--) {
			var regionName = sloveniaRegionMap.arrayRegionsMapping[i.toString()];
			sloveniaRegionMap.regions[i].setStyle(sloveniaRegionMap.style(statsData[regionName]));
		};

		info.update();
	},

	/*
	highlightFeature()highlights the polygon under the mouseover
	*/
	highlightFeature: function(e) 
	{
	    var layer = e.target;

	    layer.setStyle({
	        weight: 5,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.7
	    });

	    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }

	    //we also have to update the infoPanel with data about the polygon
	    info.update(layer.feature.statsData);

	}
}

var utils = 
{
	findMin: function(parameterName)
	{
		var min = Math.min.apply(Math, this.getNumberArrayFromJSON(parameterName));
		console.log("findMax(): Min is "+min);
		return min;
	},

	findMax: function(parameterName)
	{
		var max = Math.max.apply(Math, this.getNumberArrayFromJSON(parameterName));
		console.log("findMax(): Max is "+max);
		return max;
	},

	getNumberArrayFromJSON: function(parameterName)
	{
		var tempArray = [];
		for (var key in statsData) {
			if (statsData.hasOwnProperty(key)) {
				tempArray.push(statsData[key][parameterName])
			}
		}
		return tempArray;
	},

	verySimpleScaleCalculation: function(min,max,steps)
	{
		var range = max - min;
		var scale = [];

		for (var i = 0; i < steps; i++) {
			if(i!=0)
			{
				scale[i] = scale[i-1] + range/steps;
			}
			else
			{
				scale[i] = min + range/steps;
			}
		};
		return scale;
	}
}

$(document).ready(function() {
	sloveniaRegionMap.init();
	sloveniaRegionMap.addSettings();

	$("input:radio").change(function() {
		sloveniaRegionMap.checkboxesChange($(this));
	});
});








