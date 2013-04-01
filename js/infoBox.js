var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	this._div.innerHTML = '<h4>Region data</h4>' +  'Hover over a region';
	if(props)
	{
		this._div.innerHTML = '<h4>Region data</h4>';
		for (var key in props) {
			if (props.hasOwnProperty(key)) {
				this._div.innerHTML = this._div.innerHTML + '<b>' + key +"</b>: "+ props[key] + "<br />";
			}
		}
	}
	
    
};

info.addTo(map);