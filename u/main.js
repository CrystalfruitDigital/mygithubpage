$(document).mouseup(function (e)
{
    var container = $(".addLinkDiv");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide('fast');
    }
});

//Firebase
// CREATE A REFERENCE TO FIREBASE
var messagesRef = new Firebase('https://torid-torch-6407.firebaseio.com/');

// REGISTER DOM ELEMENTS
var messageField = $('#messageInput');
var linkField = $('#linkInput');
var messageList = $('#messages');
var key;

// LISTEN FOR KEYPRESS EVENT
messageField.keypress(function (e) {
if (e.keyCode == 13) {
  //FIELD VALUES
  var link = linkField.val();
  var message = messageField.val();

  //SAVE DATA TO FIREBASE AND EMPTY FIELD
  messagesRef.push({name:link, text:message});
  linkField.val('');
  messageField.val('');
  $('.addLinkDiv').toggle('slow');
}
});
linkField.keypress(function (e) {
if (e.keyCode == 13) {
  //FIELD VALUES
  var link = linkField.val();
  var message = messageField.val();

  //SAVE DATA TO FIREBASE AND EMPTY FIELD
  messagesRef.push({name:link, text:message});
  linkField.val('');
  messageField.val('');
  $('.addLinkDiv').toggle('slow');
}
});

// Add a callback that is triggered for each chat message.
messagesRef.on('child_added', function (snapshot) {
//GET DATA
var key = snapshot.key();
var data = snapshot.val();
var link = data.name || "anonymous";
var message = data.text;

//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
var messageElement = $("<li id="+key+" onClick=removeMessage(&#39;"+key+"&#39;)>");
var nameElement = $("<strong class='link'></strong>")
nameElement.text(link);
messageElement.text(message).prepend("<br>Tag: ").prepend(nameElement);

var viewElement = $("<div id=view"+key+" class=viewElement onClick=viewLink('"+link+"')>View</div>")

//ADD MESSAGE
messageList.append(messageElement).append(viewElement);

//SCROLL TO BOTTOM OF MESSAGE LIST
messageList[0].scrollTop = messageList[0].scrollHeight;
$("#messageStore").animate({ scrollTop: $('#messageStore')[0].scrollHeight}, 0);
});


removeMessage = function(key){
  if(window.confirm("Are you sure you want to delete this message?")){
    var keyRef = new Firebase('https://torid-torch-6407.firebaseio.com/'+key);
    keyRef.remove();
    $("#"+key).hide();
    $("#view"+key).hide();
  }
};

viewLink = function(link){
  var video = "http://youtube.com/embed/"+(link.split("?v=").pop()+"?rel=0&autoplay=1");
  $("#videoView").attr('src', video);
};

removeAll = function(){
	messagesRef.remove();
	$('#messages').empty();
};