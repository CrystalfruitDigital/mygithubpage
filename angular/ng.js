var app = angular.module("myApp", []);
app.controller('MainController', ['$scope', function($scope){
	var ngTest = $scope.ngTest;
	var ngTestText = "{{ngTest}}";
}]);