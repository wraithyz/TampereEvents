var eventlist = $(".media-list");
var events = new Array();

$(document).on('click', 'a', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    window.open(url, '_blank');
});

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
    url += category ? "&tag=" + category : "";
    url += endDate ? "&end_datetime=" + endDate : "";
    url += free ? "&free=" + free : "";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            insertEvents(req.responseText);
        }
    };
    req.open("GET", url + "&limit=10", true);
    req.send();
}

function findClosestStartTime(event) {
    var today = new Date();
    var now = (new Date(today.getFullYear(), today.getMonth(), today.getDate())).getTime();
    for (j = 0; event.times.length; j++) {
        if (event.times[j].start_datetime >= now) {
            return {
                start_datetime: event.times[j].start_datetime,
                end_datetime: event.times[j].end_datetime
            };
        }
    }
    return {
        start_datetime: event.times[event.times.length - 1].start_datetime,
        end_datetime: event.times[event.times.length - 1].end_datetime
    };
}

function insertEvents(data, favorites) {
    events = [];
    eventlist.empty();
    if (data) {
        var unFilteredEvents = JSON.parse(data);
        for (i = 0; i < unFilteredEvents.length; i++) {
            var times;
            if (unFilteredEvents[i].single_datetime === false) {
                if (favorites) {
                    times = {
                        start_datetime: unFilteredEvents[i].times.start_datetime,
                        end_datetime: unFilteredEvents[i].times.end_datetime
                    }
                } else {
                    times = findClosestStartTime(unFilteredEvents[i]);
                }
            } else {
                if (favorites) {
                    times = {
                        start_datetime: unFilteredEvents[i].times.start_datetime,
                        end_datetime: unFilteredEvents[i].times.end_datetime
                    }
                } else {
                    times = {
                        start_datetime: unFilteredEvents[i].start_datetime,
                        end_datetime: unFilteredEvents[i].start_datetime
                    };
                }
            }
            events.push({
                item_id: unFilteredEvents[i].item_id,
                title: unFilteredEvents[i].title,
                description: unFilteredEvents[i].description,
                contact_info: {
                    address: unFilteredEvents[i].contact_info.address,
                    city: unFilteredEvents[i].contact_info.city,
                    link: unFilteredEvents[i].contact_info.link,
                },
                image: {
                    src: unFilteredEvents[i].hasOwnProperty("image") ? unFilteredEvents[i].image.src : "img/placeholder.jpg"
                },
                is_free: unFilteredEvents[i].is_free,
                single_datetime: unFilteredEvents[i].single_datetime,
                times: times
            });
        }
        events.sort(function(a, b) {
            return a.times.start_datetime - b.times.start_datetime;
        });
        for (i = 0; i < events.length; i++) {
            var startTime = new Date(events[i].times.start_datetime);
            eventlist.append(
                $('<li/>', {
                    'class': 'media'
                }).append(
                    $('<div/>', {
                        'class': 'media-left'
                    }).append(
                        $('<img/>', {
                            'src': events[i].image.src,
                            'class': 'media-object'
                        })
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
                    ).append(
                        $('<a/>', {
                            'href': events[i].contact_info.link
                        }).append(
                            $('<p/>', {
                                'class': 'media-link',
                                'text': events[i].contact_info.link
                            })
                        )
                    )
                ).append(
                    $('<div/>', {
                        'class': 'media-right'
                    }).append(
                        $('<button/>', {
                            'class': 'btn btn-defaut favorite-button',
                            'id': 'favorite-button-' + events[i].item_id,
                            'value': events[i].item_id
                        }).append(
                            $('<span/>', {
                                'class': 'glyphicon glyphicon-star'
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
                ).append(
                    $('<div/>', {
                        'class': 'pull-right'
                    }).append(
                        $('<button/>', {
                            'class': 'btn btn-defaut comments-button',
                            'id': 'comments-button-' + events[i].item_id,
                            'value': events[i].item_id,
                            'text': 'Kommentit'
                        }).append(
                            $('<span/>', {
                                'class': 'glyphicon glyphicon-menu-down pull-left',
                                'style': 'padding-right:5px'
                            })))
                ).append(
                    $('<div/>', {
                        'class': 'collapse'
                    }).append(
                        $('<div/>', {
                            'class': 'media'
                        })
                        .append(
                            $('<input/>', {
                                'type': 'text',
                                'id': 'name-input-' + events[i].item_id,
                                'placeholder': 'Nimi',
                                'class': 'form-control comment-name'
                            })
                        )
                        .append(
                            $('<textarea/>', {
                                'type': 'text',
                                'id': 'comment-input-' + events[i].item_id,
                                'class': 'form-control comment-comment',
                                'placeholder': 'Kommentti'
                            })
                        )
                        .append(
                            $('<button/>', {
                                'class': 'btn btn-defaut comment-send-button',
                                'id': 'comment-send-button-' + events[i].item_id,
                                'text': 'Lähetä',
                                'value': events[i].item_id
                            })
                        ).append(
                            $('<hr/>')
                        ).append(
                            $('<h4/>', {
                                'text': 'Kommentit'
                            })).append(
                            $('<ul/>', {
                                'id': 'comment-list-' + events[i].item_id
                            })
                        )
                    )));
        }
    }
    $(".marker-button").click(geoLocateSingleEvent);
    $(".favorite-button").click(setFavorite);
    $(".comments-button").click(showComments);
    $(".comment-send-button").click(postComment);
    readFavorites();
    geoLocateAllEvents();
}
