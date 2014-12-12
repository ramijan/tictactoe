
var tictactoeApp = angular.module('tictactoeApp', []);

tictactoeApp.controller('BoardController', ['$scope', function($scope){
	
	$scope.boardArray = [[null,null,null],[null,null,null],[null,null,null]];
	$scope.playerOneTurn = true;

	$scope.play = function(row, column) {
		if(!$scope.boardArray[row][column]) {
			$scope.boardArray[row][column] = $scope.playerOneTurn ? 'X' : 'O';
			console.log($scope.boardArray);
			$scope.playerOneTurn = !$scope.playerOneTurn;
			$scope.alertGameOver();
		}
	};

	$scope.resetBoard = function() {
		$scope.boardArray = [[null,null,null],[null,null,null],[null,null,null]];
		$scope.playerOneTurn = true;
		console.log($scope.boardArray);
	};

	$scope.alertGameOver = function() {
		var done = $scope.isGameOver();
		if(done=='X') {
			alert("Player 1 wins!");
		}
		else if (done=='O') {
			alert("Player 2 wins!");
		}
		else if (done=='XO') {
			alert("It's a tie!");
		}
	}

	$scope.isGameOver = function() {
		var b = $scope.boardArray;

		//check rows
		for(var i = 0; i < b.length; i++) {
			if(b[i][0] && b[i][0] == b[i][1] && b[i][1] == b[i][2]) return b[i][0];
		}
		//check columns
		for(var j = 0; j < b[0].length; j++) {
			if(b[0][j] && b[0][j] == b[1][j] && b[1][j] == b[2][j]) return b[0][j];
		}
		//check diagonals
		if(b[0][0] && b[0][0] == b[1][1] && b[1][1] == b[2][2]) return b[0][0];
		if(b[0][2] && b[0][2] == b[1][1] && b[1][1] == b[2][0]) return b[0][2];
		//check tie
		for(var i = 0; i < b.length; i++) {
			for(var j = 0; j < b[i].length; j++) {
				if(b[i][j] == null) return;
			}
		}
		return 'XO';
	}

}]);