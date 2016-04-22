$("#search-button").click(searchEvents);
$("#clear-button").click(clearSearch);

function validateDate(date) {
    if (date) {
        var splitDate = date.split(".");
        if (splitDate.length === 3) {
            var day = parseInt(splitDate[0]);
            if (day > 0 && day <= 31) {
                var month = parseInt(splitDate[1]) + 1;
                if (month > 0 && month <= 12) {
                    var year = parseInt(splitDate[2]);
                    if (year >= 1970) {
                        return splitDate;
                    }
                }
            }
        }
    }
    return false;
}

function searchEvents() {
    var text = $("#search-input-text").val();
    var category = $("#search-input-category").val() !== "Valitse kategoria" ? $("#search-input-category").val() : "";
    var start = validateDate($("#start-date").val());
    var end = validateDate($("#end-date").val());
    var startDate = start ? (new Date(start[2], parseInt(start[1]) - 1, start[0])).getTime() : "";
    var endDate = end ? (new Date(end[2], parseInt(end[1]) - 1, end[0])).getTime() : "";
    console.log(startDate);
    console.log(endDate);
    console.log(text);
    console.log(category);
    loadEvents(text, category, startDate, endDate);
}

function clearSearch() {
   $("#search-input-text").val("");
   $("#search-input-category").val("Valitse kategoria");
   $("#start-date").val("");
   $("#end-date").val("");
}
