function Game() {
	this.board = [[null,null,null],[null,null,null],[null,null,null]];
	this.playerOneTurn = true;
	this.moveCount = 0;
	this.gameOver = false;
	this.moveList = [];
}

function Move(token, row, column) {
	this.token = token;
	this.row = row;
	this.column = column;
}


var tictactoeApp = angular.module('tictactoeApp', []);

tictactoeApp.controller('BoardController', ['$scope', function($scope){
	
	$scope.game = new Game();
	$scope.history = [];
	$scope.lastMove = '';
	console.log($scope.game);

	
	$scope.play = function(row, column) {
		
		//block further moves if game is over
		if($scope.game.gameOver) {
			return;
		}

		if(!$scope.game.board[row][column]) {
			var token = $scope.game.playerOneTurn ? 'X' : 'O';
			$scope.lastMove = token + ' played at ' + row + ", " + column;
			$scope.game.board[row][column] = token;
			$scope.game.moveList.push(new Move(token, row, column));
			console.log($scope.game.board);
			$scope.game.playerOneTurn = !$scope.game.playerOneTurn;
			$scope.isGameOver();
		}
	};



	$scope.resetBoard = function() {
		$scope.history.push(angular.copy($scope.game));
		console.log($scope.game.moveList);
		console.log($scope.history);
		$scope.game = new Game();
	};

	$scope.turnNotif = function() {
		if($scope.game.gameOver) {
			return "Game Over";
		} 
		else if($scope.game.playerOneTurn) {
			return "Player 1 turn";
		}
		else {
			return "Player 2 turn";
		}
	}

	// $scope.alertGameOver = function() {
	// 	var done = $scope.isGameOver();
	// 	//TODO: replace alerts with something more interesting
	// 	if(done=='X') {
	// 		$scope.game.lastMove += "\nPlayer 1 wins!";
	// 	}
	// 	else if (done=='O') {
	// 		$scope.game.lastMove += "\nPlayer 2 wins!";
	// 	}
	// 	else if (done=='XO') {
	// 		$scope.game.lastMove += "\nIt's a cat's game (tie)!";
	// 	}
	// }

	$scope.isGameOver = function() {
		var b = $scope.game.board;

		//check rows
		for(var i = 0; i < b.length; i++) {
			if(b[i][0] && b[i][0] == b[i][1] && b[i][1] == b[i][2]) {
				$scope.game.gameOver = true;
				console.log($scope.game.gameOver)
				return b[i][0];
			}
		}
		//check columns
		for(var j = 0; j < b[0].length; j++) {
			if(b[0][j] && b[0][j] == b[1][j] && b[1][j] == b[2][j]) {
				$scope.game.gameOver = true;
				return b[0][j];
			}
		}
		//check diagonals
		if(b[0][0] && b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
			$scope.game.gameOver = true;
			return b[0][0];
		}
		if(b[0][2] && b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
			$scope.game.gameOver = true;
			return b[0][2];
		}
		//check tie (and game not complete)
		for(var i = 0; i < b.length; i++) {
			for(var j = 0; j < b[i].length; j++) {
				if(b[i][j] == null) return;
			}
		}
		$scope.game.gameOver = true;
		return 'XO';
	}

}]);