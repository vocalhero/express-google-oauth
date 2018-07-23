//Create a single global variable
var MAPAPP = {};
MAPAPP.markers = [];
MAPAPP.currentInfoWindow;
MAPAPP.pathName = window.location.pathname;

$(document).ready(function() {
    initialize();
    populateMarkers(MAPAPP.pathName);
});

//Initialize our Google Map
function initialize() {

    var element = document.getElementById("mapdata");
    var dataset = element.dataset;
    var data = dataset.points;

///    var center = new google.maps.LatLng(39.9543926,-75.1627432);
    var center = new google.maps.LatLng(33.790173,130.9979);
    var mapOptions = {
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        center: center,
    };
    this.map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
};

function isValidURL(string) {
    if (string === undefined) return false;
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
        return false;
    else
        return true;
};

// Fill map with markers
function populateMarkers(dataType) {
    //apiLoc = typeof apiLoc !== 'undefined' ? apiLoc : '/data/' + dataType + '.json';

    var element = document.getElementById("mapdata");
    var dataset = element.dataset;
    var datapoints = dataset.points;
    var data = JSON.parse(decodeURI(datapoints)).values;

    var bound = new google.maps.LatLngBounds();
    var header = [];

    //For each item in our JSON, add a new map marker
    data.forEach(function(row, index) {
        if (index === 0) {
            header = row
            return;
        }

        var info = "";
        var markerProps = {};
        header.forEach(function(par, j) {
            markerProps[par] = row[j];

            if(isValidURL(row[j])) {
                info = info + '<p>' +'<a href="' + row[j] + '" target="_blank" title="' + par + '">' + par + '</a>'+ '</p>';
                info = info + '<p>' +'<img src="' + row[j] + '" alt="HTML5 Icon" height="256"' + '</img>'+ '</p>';

            } else {
                info = info + '<p>' + par + " : " + row[j] + '</p>';

            }
        })

        var location = new google.maps.LatLng(markerProps.Latitude, markerProps.Longitude);
        markerProps["position"] = location
        markerProps["icon"] = getCircle(Number(markerProps.Radius), markerProps.Color)
        bound.extend(location);

        var marker = new google.maps.Marker(markerProps);
        /*
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            site: row[0],
            priority: row[3],
            costMJPY: row[4],
            photo1: row[5],
            photo2: row[6],
            icon: getCircle(row[4])
        });
        */
        function getCircle(magnitude, color) {
            return {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: .5,
                scale: magnitude + 10,
                strokeColor: color,
                strokeWeight: 1
            };
        }

        //Build the content for InfoWindow
        // var content = '<h1 class="mt0"><a href="' + marker.Photo1 + '" target="_blank" title="' + marker.Site + '">' + marker.Priority + '</a></h1><p>' + marker.details + '</p>';
        marker.infowindow = new google.maps.InfoWindow({
            content: info,
            maxWidth: 400
        });
        //Add InfoWindow
        google.maps.event.addListener(marker, 'click', function() {
            if (MAPAPP.currentInfoWindow) MAPAPP.currentInfoWindow.close();
            marker.infowindow.open(map, marker);
            MAPAPP.currentInfoWindow = marker.infowindow;
        });
        MAPAPP.markers.push(marker);
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, MAPAPP.markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    // position the center of the map at the center of the dataset
    map.setCenter(bound.getCenter());
    map.fitBounds(bound);
    markerCluster.setMaxZoom(map.getZoom() + 1);
};
