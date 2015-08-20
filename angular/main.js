$(document).ready(function() {
    hideAllStart();
});

$(window).resize(function(){
  if($(window).width() >= 1000){
    $('#menu').show();
    $('#chat').show();
  } else {
    $('#menu').hide();
    $('#chat').hide();
  }
});

hideAllStart = function() {
    $('.section').hide();
}

hideAll = function(){
    $('.section').hide("fast");
}

showAll = function() {
    $('.section').show("fast");
}

toggleSection = function(sectionName){
  var sectionName = sectionName;
  $('#'+sectionName).toggle("fast");
}

toggleNav = function(){
  $('#menu').toggle("fast");
  if($('#slider').text() == '>>'){
    $('#slider').text('<<');
  } else {
    $('#slider').text('>>');
  }
}

//Firebase
// CREATE A REFERENCE TO FIREBASE
var messagesRef = new Firebase('https://vivid-torch-90.firebaseio.com/');

// REGISTER DOM ELEMENTS
var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('#messages');
var key;

// LISTEN FOR KEYPRESS EVENT
messageField.keypress(function (e) {
if (e.keyCode == 13) {
  //FIELD VALUES
  var username = nameField.val();
  var message = messageField.val();

  //SAVE DATA TO FIREBASE AND EMPTY FIELD
  messagesRef.push({name:username, text:message});
  messageField.val('');
}
});

// Add a callback that is triggered for each chat message.
messagesRef.limitToLast(10).on('child_added', function (snapshot) {
//GET DATA
var key = snapshot.key();
var data = snapshot.val();
var username = data.name || "anonymous";
var message = data.text;

//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
var messageElement = $("<li id="+key+" onClick=removeMessage(&#39;"+key+"&#39;)>");
var nameElement = $("<strong class='username'></strong>")
nameElement.text(username);
messageElement.text(message).prepend(": ").prepend(nameElement);

//ADD MESSAGE
messageList.append(messageElement)

//SCROLL TO BOTTOM OF MESSAGE LIST
messageList[0].scrollTop = messageList[0].scrollHeight;
$("#messageStore").animate({ scrollTop: $('#messageStore')[0].scrollHeight}, 1000);
});

removeMessage = function(key){
  if(window.confirm("Are you sure you want to delete this message?")){
    var keyRef = new Firebase('https://vivid-torch-90.firebaseio.com/'+key);
    keyRef.remove();
    $("#"+key).hide();
  }
};

removeAll = function(){
	if(window.confirm("Are you sure you want to delete the entire chat?")){
		messagesRef.remove();
		$('#messages').empty();
	}
};