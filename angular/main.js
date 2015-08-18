$(document).ready(function() {
    hideAllStart();
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