var board = [null, null, null, null, null, null, null, null, null];

var tttApp = angular.module('tttApp', []);

tttApp.controller('BoardController', ['$scope', function($scope){
	$scope.play = function(row, column) {
	//	if(isValidMove(row,column)) {
			console.log("played at " + row + " " + column);
	//	}
	};
}]);