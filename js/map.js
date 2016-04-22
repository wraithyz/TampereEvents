var map;
var markers = new Array();

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            // Tampere.
            lat: 61.4982,
            lng: 23.761
        },
        zoom: 12
    });
}

function addMarker(lat, lng, title) {
    var latLng = {
        lat: lat,
        lng: lng
    }
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title
    });
    map.setZoom(14);
    map.panTo(marker.position);
    markers.push(marker);
}

function hideMarkers() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function geoLocate() {
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
    if (address) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyDPU72Fl2qvt9EnTsY2HWdBvrc_kidGE5A";
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                var data = JSON.parse(req.responseText);
                if (data.status === "OK") {
                    hideMarkers();
                    button.children("span").css("color", "green");
                    addMarker(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, title);
                }
            }
        };
        req.open("GET", url, true);
        req.send();
    }
}
