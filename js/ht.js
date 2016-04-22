var eventlist = $(".media-list");
var events;

window.onload = function() {
    loadEvents();
};

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
    events = JSON.parse(data);
    eventlist.empty();
    for (i = 0; i < events.length; i++) {
        var startTime = events[i].single_datetime === false ? new Date(events[i].times[0].start_datetime) : new Date(events[i].start_datetime);
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
                        'class': 'btn btn-defaut',
                        'id': 'favorite-button-' + events[i].item_id,
                        'value': events[i].item_id
                    }).append(
                        $('<span/>', {
                            'class': 'glyphicon glyphicon-star',
                            'style': 'color:yellow'
                        })))
            ).append(
                $('<div/>', {
                    'class': 'media-right'
                }).append(
                    $('<button/>', {
                        'class': 'btn btn-defaut marker-button',
                        'id': 'marker-button-' + events[i].item_id,
                        'value': events[i].item_id
                    }).append(
                        $('<span/>', {
                            'class': 'glyphicon glyphicon-map-marker'
                        })))
            ));
    }
    $(".marker-button").click(geoLocateSingleEvent);
    geoLocateAllEvents();
}
