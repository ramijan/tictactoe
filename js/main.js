// This constructor instantiates a new game
function Game() {
	this.board = [[null,null,null],[null,null,null],[null,null,null]];
	this.playerOneTurn = true;
	this.moveCount = 0;
	this.gameOver = false;
	this.moveList = [];
}

// This constructor instantiates a new move object (used) to
// store a game's history in its moveList property
function Move(token, row, column) {
	this.token = token;
	this.row = row;
	this.column = column;
}

function Player(username) {
	this.username = username;
	this.searching = false;
	this.chat = '';
}

// Create angular module
var tictactoeApp = angular.module('tictactoeApp', []);

// Create Board controller
tictactoeApp.controller('AppController', ['$scope', function($scope){
	
	// Create initial game
	$scope.game = new Game();
	// Array to store past games
	$scope.gameHistory = [];
	// Last move string, used to display during gameplay
	$scope.lastMove = '';
	// Array to store chats
	$scope.chats = [];
	$scope.players = [
		{ username: 'ramijan',
			searching: false,
			chat: '' },
		{ username: 'hadi',
			searching: false,
			chat: ''}
	];
	$scope.player1 = $scope.players[0];
	$scope.player2 = $scope.players[1];

	console.log($scope.game);

	
	// play() is triggered after each player makes their move.
	// It makes sure the move is valid and then takes care of
	// displaying the player token on the gameboard and storing the
	// move in the moveHistory array.  It also switches the turn to opponent
	// and finally checks if the move caused Game Over state
	$scope.play = function(player, row, column) {
		
		//block move if it's not your turn
		if(player == $scope.player1 && !$scope.game.playerOneTurn) {
			return;
		}
		else if(player == $scope.player2 && $scope.game.playerOneTurn) {
			return;
		}
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


	// sendChat() posts submitted chat messages to the chats array,
	// which is bound to the chat display area
	$scope.sendChat = function(player) {
			if ($scope.chats.length >= 10) $scope.chats.shift();
			$scope.chats.push(player.username + ": " + player.chat);
			player.chat = '';
	};


	// resetBoard() makes a copy of the current game and pushes it onto
	// the gameHistory array and then resets the game
	$scope.resetBoard = function() {
		$scope.gameHistory.push(angular.copy($scope.game));
		console.log($scope.game.moveList);
		console.log($scope.gameHistory);
		$scope.game = new Game();
	};


	// turnNotif() returns a string telling which player's turn it is,
	// or Game Over (used for display on the page)
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


	// isGameOver() checks the gameboard for all Game Over states
	// If it finds game over it turns the game's gameOver property to true
	// and returns the token of the winning player
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