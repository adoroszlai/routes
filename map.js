var page = page_name();

function page_name() {
	var path = window.location.pathname;
	var lastSlash = path.lastIndexOf('/');
	var page = '';
	if (lastSlash > 0) {
		page = path.substr(lastSlash+1);
	}
	var lastDot = page.lastIndexOf('.');
	if (lastDot > 0) {
		page = page.substr(0, lastDot);
	}
	return page;
}

function init_route_map() {
	var page = page_name();
	if (page === 'utvonal.html') {
		page = '123';
	}
	_init_route_map(page + ".gpx");
}

function _init_route_map(route_name) {
	var map = L.map('map');
	new L.OSM.CycleMap().addTo(map);
	new L.OSM.HuHiking().addTo(map);

	var elevation = L.control.elevation({width:500});
	elevation.addTo(map);

	$.get("routes/" + route_name, function(data) {
		var route = new L.GPX(data, {
			async: true,
			marker_options: {
				startIconUrl: 'lib/leaflet-gpx/pin-icon-start.png',
				endIconUrl: 'lib/leaflet-gpx/pin-icon-end.png',
				shadowUrl: 'lib/leaflet-gpx/pin-shadow.png'
			}
		});
		var fitBounds = function() {
			setTimeout(function() {
				map.fitBounds(route.getBounds(), { padding: [25, 25] });
			});
		};
		route.on('loaded', fitBounds);
		route.on('addline', function(e) {
			elevation.addData(e.line);
		});
		map.addLayer(route);

		fitBounds();
	});
}
