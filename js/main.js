
var tictactoeApp = angular.module('tictactoeApp', []);

tictactoeApp.controller('BoardController', ['$scope', function($scope){
	
	$scope.boardModel = [[null,null,null],[null,null,null],[null,null,null]];
	$scope.playerOneTurn = true;

	$scope.play = function(row, column) {
		if(!$scope.boardModel[row][column]) {
			$scope.boardModel[row][column] = $scope.playerOneTurn ? 'X' : 'O';
			console.log($scope.boardModel);
			$scope.playerOneTurn = !$scope.playerOneTurn;
		}
	};
}]);