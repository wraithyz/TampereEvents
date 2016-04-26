$("#locate-button").click(locateUser);
$("#locate-events-button").click(geoLocateAllEvents);

var map;
var markers = new Array();

var tampere = {
    lat: 61.4982,
    lng: 23.761
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: tampere,
        zoom: 12
    });
}

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            addMarker(pos, "Olet tässä!", true, true);
        }, function() {
            console.log("Could not find location.");
        }, {
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        console.log("Not supported.");
    }
}

function addMarker(latLng, title, pan, custom) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title
    });
    if (custom) {
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    }
    if (pan) {
        map.setZoom(14);
        map.panTo(marker.position);
    } else {
        map.setZoom(12);
        map.panTo(tampere);
    }
    markers.push(marker);
}

function hideMarkers() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function geoLocate(address, id, title) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyDPU72Fl2qvt9EnTsY2HWdBvrc_kidGE5A";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var data = JSON.parse(req.responseText);
            if (data.status === "OK") {
                var latLng = {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng
                }
                storeGeoLocationData(id, latLng);
                addMarker(latLng, title);
            }
        }
    };
    req.open("GET", url, true);
    req.send();
}

function geoLocateAllEvents() {
    hideMarkers();
    $(".glyphicon-map-marker").css("color", "green");
    for (i = 0; i < events.length; i++) {
        var id = events[i].item_id;
        var address = events[i].contact_info.address + ', ' + events[i].contact_info.city;
        var title = events[i].title;
        if (sessionStorage.getItem(id)) {
            console.log("All: Reading from Sessionstorage.");
            addMarker(JSON.parse(sessionStorage.getItem(id)), title);
        } else {
            geoLocate(address, id, title);
        }
    }
}

function geoLocateSingleEvent() {
    var button = $(this);
    var id = button.val();
    var address;
    var title;
    for (i = 0; i < events.length; i++) {
        if (events[i].item_id == id) {
            address = events[i].contact_info.address + ', ' + events[i].contact_info.city;
            title = events[i].title;
            break;
        }
    }
    if (address && title) {
        $(".glyphicon-map-marker").css("color", "gray");
        hideMarkers();
        button.children("span").css("color", "green");
        if (sessionStorage.getItem(id)) {
            console.log("Single: Reading from Sessionstorage.");
            addMarker(JSON.parse(sessionStorage.getItem(id)), title, true);
        } else {
            geoLocate(address, id, title);
        }
    }
}

function storeGeoLocationData(id, location) {
    if (typeof(Storage) !== "undefined") {
        console.log("Saving to Sessionstorage.");
        sessionStorage.setItem(id, JSON.stringify(location));
    } else {
        console.log("Sessionstorage not supported.");
    }
}
