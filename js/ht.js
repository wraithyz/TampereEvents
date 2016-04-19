var eventlist = $(".media-list");

window.onload = loadEvents;

function loadEvents() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            insertEvents(req.responseText);
        }
    };
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var milliseconds = start.getTime();
    req.open("GET", "http://visittampere.fi:80/api/search?type=event&start_datetime=" + milliseconds + "&limit=5", true);
    req.send();
}

function insertEvents(data) {
    var events = JSON.parse(data);
    for (i = 0; i < events.length; i++) {
      var startTime = new Date(events[0].times[0].start_datetime);
        eventlist.append(
            $('<li/>', {
                'class': 'media'
            }).append(
                $('<div/>', {
                    'class': 'media-left'
                }).append(
                    $('<a/>', {
                        'href': '#'
                    }).append(
                        $('<img/>', {
                            'src': events[i].image.src,
                            'class': 'media-object'
                        })
                    )
                )
            )
            .append(
                $('<div/>', {
                    'class': 'media-body'
                }).append(
                    $('<h4/>', {
                        'class': 'media-heading',
                        'text': events[i].title
                    })
                ).append(
                    $('<p/>', {
                        'class': 'media-address',
                        'text': events[i].contact_info.address
                    })
                ).append(
                    $('<p/>', {
                        'class': 'media-date',
                        'text': startTime.getDate() + '.' +
                        (parseInt(startTime.getMonth()) + 1)+ '.' +
                        startTime.getFullYear() + ' ' +
                        startTime.getHours() + ':' +
                        (startTime.getMinutes() == '0' ? startTime.getMinutes() + '0' : startTime.getMinutes())
                    })
                ).append(
                    $('<p/>', {
                        'class': 'media-description',
                        'text': events[i].description
                    })
                )
            ));
    }
}

/*window.onload = initMap;

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 61.4982,
            lng: 23.761
        },
        zoom: 8
    });
}*/
