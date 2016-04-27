$("#favorites-button").click(function() {
    $("#list-header").children("span").text(" SUOSIKIT");
    $("#list-header").children("span").removeClass("glyphicon-search");
    $("#list-header").children("span").addClass("glyphicon-star");
    var events = new Array();
    if (localStorage.getItem("favorites")) {
        var favorites = JSON.parse(localStorage.getItem("favorites"));
        insertEvents(JSON.stringify(favorites), true);
    } else {
        insertEvents(null, true);
    }
});

function readFavorites() {
    var buttons = $(".favorite-button");
    if (localStorage.getItem("favorites")) {
        var favorites = JSON.parse(localStorage.getItem("favorites"));
        for (i = 0; i < buttons.length; i++) {
            for (j = 0; j < favorites.length; j++) {
                if (buttons[i].value == favorites[j].item_id) {
                    buttons[i].children[0].style.color = "yellow";
                    break;
                }
            }
        }
    }
}

function setFavorite() {
    var button = $(this);
    var id = button.val();
    if (localStorage.getItem("favorites")) {
        var favorites = JSON.parse(localStorage.getItem("favorites"));
        var found = false;
        for (j = 0; j < favorites.length; j++) {
            if (id == favorites[j].item_id) {
                console.log("Removing from localStorage");
                favorites.splice(j, 1);
                button.children("span").css("color", "white");
                found = true;
                break;
            }
        }
        if (!found) {
            for (i = 0; i < events.length; i++) {
                if (events[i].item_id == id) {
                    favorites.push(events[i]);
                    console.log("Adding to localStorage: " + id);
                    button.children("span").css("color", "yellow");
                    break;
                }
            }
        }
        if (favorites.length == 0) {
            localStorage.removeItem("favorites");
        } else {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }

    } else {
        for (i = 0; i < events.length; i++) {
            if (events[i].item_id == id) {
                console.log("Adding to localStorage: " + id);
                var tmp = new Array();
                tmp.push(events[i]);
                localStorage.setItem("favorites", JSON.stringify(tmp));
                button.children("span").css("color", "yellow");
                break;
            }
        }
    }
}
