
function showComments() {
   var button = $(this);
   var id = button.val();
   var $collapse = $(this).closest('.media').find('.collapse');
   $collapse.collapse('toggle');
}
