$(document).ready(function() {
    hideAll();
});

hideAll = function() {
    $('.section').hide("fast");
}

toggleSection = function(section){
	var sectionName = section;
	$('#'+sectionName).toggle("fast");
}