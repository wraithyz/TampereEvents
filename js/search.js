$("#search-button").click(searchEvents);

function searchEvents() {
   var text = $("#search-input-text").val();
   var category = $("#search-input-category").val() !== "Valitse kategoria" ? $("#search-input-category").val() : "";
   console.log(text);
   console.log(category);
   loadEvents(text, category);
}
