$("#favorites-button").click(function() {
   var events = new Array();
   for (i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      events.push(JSON.parse(localStorage.getItem(key)));
   }
   insertEvents(JSON.stringify(events));
});

function readFavorites() {
   var buttons = $(".favorite-button");
   for (i = 0; i < buttons.length; i++) {
      if (localStorage.getItem(buttons[i].value)) {
         buttons[i].children[0].style.color = "yellow";
      }
   }
}

function setFavorite() {
    var button = $(this);
    var id = button.val();
    if (localStorage.getItem(id)) {
        console.log("Removing from localStorage");
        localStorage.removeItem(id);
        button.children("span").css("color", "gray");
    } else {
        for (i = 0; i < events.length; i++) {
            if (events[i].item_id == id) {
                console.log("Adding to localStorage: " + id);
                localStorage.setItem(id, JSON.stringify(events[i]));
                button.children("span").css("color", "yellow");
                break;
            }
        }
    }
}
