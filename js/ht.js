var eventlist = $(".media-list");

window.onload = function() {
    loadEvents();
    initMap();
};

var map;

$('#sidebar').affix({
    offset: {
        top: $('.search').height()
    }
});

$('#start-date-picker input').datepicker({
    clearBtn: true,
    language: "fi",
    autoclose: true,
    todayHighlight: true
});

$('#end-date-picker input').datepicker({
    clearBtn: true,
    language: "fi",
    autoclose: true,
    todayHighlight: true
});

function loadEvents(searchText, category, startDate, endDate, free) {
    var url = "http://visittampere.fi:80/api/search?type=event";
    if (startDate) {
        url += "&start_datetime	=" + startDate;
    } else {
        var today = new Date();
        url += "&start_datetime	=" + (new Date(today.getFullYear(), today.getMonth(), today.getDate())).getTime();
    }
    url += searchText ? "&text=" + searchText : "";
    url += category ? "&category=" + category : "";
    url += endDate ? "&end_datetime=" + endDate : "";
    url += free ? "&free=" + free : "";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            insertEvents(req.responseText);
        }
    };
    req.open("GET", url + "&limit=5", true);
    req.send();
}

function insertEvents(data) {
    var events = JSON.parse(data);
    for (i = 0; i < events.length; i++) {
        var startTime = new Date(events[0].times[0].start_datetime);
        var picture = events[i].hasOwnProperty("image") ? events[i].image.src : "img/placeholder.jpg";
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
                            'src': picture,
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
                            (parseInt(startTime.getMonth()) + 1) + '.' +
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
            ).append(
                $('<div/>', {
                    'class': 'media-right'
                }).append(
                    $('<button/>', {
                        'class': 'btn btn-defaut'
                    }).append(
                        $('<span/>', {
                            'class': 'glyphicon glyphicon-star',
                            'style': 'color:yellow'
                        })))));
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 61.4982,
            lng: 23.761
        },
        zoom: 12
    });
}
