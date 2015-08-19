var app = angular.module("animeThemesApp", []);
app.controller('MainController', ['$scope', function($scope){
	addLink = function(){
		
	}

	$scope.linkList = [
		{'_id':'1', 'url':'test'},
		{'_id':'2', 'url':'test'},
		{'_id':'3', 'url':'test'},
	];
}]);