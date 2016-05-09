var ref = new Firebase("https://amber-inferno-8455.firebaseio.com/");
var eventCommentArray = new Array();

ref.on("child_added", function(snapshot, prevChildKey) {
    console.log(snapshot.val());
    eventCommentArray.push({
        item_id: snapshot.key(),
        comment: snapshot.val()
    });
});

ref.on("child_changed", function(snapshot) {
    for (i = 0; i < eventCommentArray.length; i++) {
        if (eventCommentArray[i].item_id == snapshot.key()) {
            eventCommentArray.push(snapshot.val());
            return;
        }
    }
    eventCommentArray.push({
        item_id: snapshot.key(),
        comment: snapshot.val()
    });
});

function formatDate(time) {
    return (time.getDate() + "." +
        (time.getMonth() + 1) + "." +
        time.getFullYear() + " " +
        time.getHours() + ":" +
        (time.getMinutes() == "0" ? time.getMinutes() + "0" : time.getMinutes()));
}

function postComment() {
    var button = $(this);
    var id = $(this).val();
    var name = $("#name-input-" + id).val();
    var comment = $("#comment-input-" + id).val();
    if (id && name && comment) {
        var eventComments = ref.child(id);
        var postsRef = eventComments.child("comments");
        postsRef.push().set({
            name: name,
            comment: comment,
            date: (new Date).getTime()
        });
        $("#name-input-" + id).val("");
        $("#comment-input-" + id).val("");
        var list = $('#comment-list-' + id);
        list.append(
            $('<li/>', {
               'id': 'comment-' + id,
               'text': name + ': \"' + comment + "\" (" + formatDate(new Date()) + ")"
            })
        );
    }
}

function appendComments(id) {
    for (i = 0; i < eventCommentArray.length; i++) {
        if (eventCommentArray[i].item_id == id) {
            var list = $('#comment-list-' + id);
            if (list) {
                for (var key in eventCommentArray[i].comment.comments) {
                    var obj = eventCommentArray[i].comment.comments[key];
                    if ($('#comment-' + key).length == 0) {
                        list.append(
                            $('<li/>', {
                                'id': 'comment-' + key,
                                'text': obj.name + ': \"' + obj.comment + "\" (" + formatDate(new Date(obj.date)) + ")"
                            })
                        );
                    }
                }
            }
        }
    }
}

function showComments() {
    var button = $(this);
    var id = button.val();
    var $collapse = $(this).closest('.media').find('.collapse');
    $collapse.collapse('toggle');
    $(this).children("span").toggleClass("glyphicon-menu-up", "glyphicon-menu-down");
    if ($collapse.attr('aria-expanded') == "true") {
        appendComments(id);
    }
}
