angular
	.module('tttApp')
	.controller('GameController', ['$scope', '$firebase', function($scope, $firebase) {

	$scope.user = getLocalData('mariotttUser');
	$scope.matchID = getLocalData('mariotttMatchID');
	$scope.boardSize = getLocalData('mariotttSize');
	$scope.stats = getStats();
	var matchObj = getMatch($scope.matchID);
	
	// Bind matchObj to $scope.game variable (to create 3-way binding) and then run game intialization code
	matchObj.$bindTo($scope, 'game').then(function() {
		if('needPlayerTwo' in matchObj && 'playerOne' in matchObj && $scope.game.playerOne != $scope.user) {
			$scope.game.needPlayerTwo = false;
			$scope.game.playerTwo = $scope.user;
		}
		else if(('playerOne' in matchObj) && $scope.game.playerOne == $scope.user) {
			// do nothing in this case
		}
		else {
			var newgame = new Game();
			matchObj.$inst().$set(newgame);
			//  Using the 3-way binding variable doesn't work.  Object shows up in firebase, but then the 
			//if clause silently fails when player two joins the game
			//$scope.game.$set(newgame);	
			//$scope.game = newgame;
		}
	});

	// Gets data from localStorage or triggers error alert and redirects to lobby if data is not present
	function getLocalData(property) {
		if(!localStorage[property]) {
			alert('something went wrong. ' + property + ' not found.  Returning to Lobby');
			location.href = "index.html";
		} else {
			return localStorage[property];
		}
	}

	// Get stats object from Firebase (to track total mario/luigi wins)
	function getStats() {
		var ref = new Firebase("https://rami-ttt.firebaseio.com/mariottt/stats/");
		return $firebase(ref).$asObject();
	}

	// Get match object from firebase
	function getMatch(matchID) {
		var ref = new Firebase("https://rami-ttt.firebaseio.com/mariottt/matches/" + matchID);
		return $firebase(ref).$asObject();
	}

	// Constructor to create new game object.  Game is tracked by an array of arrays, and a bunch of other
	// tracking and flag variables
	function Game() {
		this.boardSize = $scope.boardSize;
		this.board = createBoard($scope.boardSize);
		this.playerOne = $scope.user;
		this.playerTwo = '';
		this.needPlayerTwo = true;
		this.playerOneTurn = true;
		this.playerOneStarts = true;
		this.gameOver = false;
		this.winner = '';
		this.playerOneWins = 0;
		this.playerTwoWins = 0;
	}

	// Helper function for Game constructor.  Creates game array
	function createBoard(size) {
		var board = [];
		for(var i = 0; i < size; i++) {
			board[i] = [];
			for(var j = 0; j < size; j++) {
				board[i][j] = '';
			}
		}
		return board;
	}

	//had to make this variable to get around nested ng-repeat issue with $scope.
	var boardArraySize = $scope.boardSize;
	// Creates array for use in <td> ng-repeat to create game board
	$scope.getBoardSizeArray = function() {
			var arr = [];
			for(var i = 0; i < boardArraySize; i++) {
				arr.push(i);
			}
			return arr;
	};

	// Resets game - called when player clicks Yes at game over screen
	$scope.resetBoard = function() {
		$scope.game.board = createBoard($scope.game.boardSize);
		$scope.game.playerOneTurn = !$scope.game.playerOneStarts;
		$scope.game.playerOneStarts = !$scope.game.playerOneStarts;
		$scope.game.gameOver = false;
		$scope.game.winner = '';
	};

	// Plays appropriate game token and then triggers game over check - called whenever a player clicks on a square
	$scope.play = function(row, column) {
		var g = $scope.game;

		//block move if it's not player's turn
		if(g.playerOne == $scope.user && !g.playerOneTurn) return;
		else if(g.playerTwo == $scope.user && g.playerOneTurn) return;

		//block moves if game over
		if(g.gameOver) return;

		//allow play only in un-used spots
		if(g.board[row][column] === '') {
			g.board[row][column] = g.playerOneTurn ? 'X' : 'O';
			g.playerOneTurn = !g.playerOneTurn;
		}

		//check if latest move caused game over
		checkGameOver();
	};

	// Sets winner and updates stats when game ends
	function setWinner(token) {
		//set winner property
		if(token == 'XO') {
			$scope.game.winner = 'tie';
		}
		else if(token == 'X') {
			$scope.game.winner = $scope.game.playerOne;
			$scope.game.playerOneWins += 1;
			$scope.stats.mario = ($scope.stats.mario ? $scope.stats.mario + 1: 1);
		}
		else if(token == 'O') {
			$scope.game.winner = $scope.game.playerTwo;
			$scope.game.playerTwoWins += 1;
			$scope.stats.luigi = ($scope.stats.luigi ? $scope.stats.luigi + 1: 1);
		}
		$scope.stats.$save();
	}

	// Checks all game over conditions and calls setWinner function if game is over
	function checkGameOver() {
		var b = $scope.game.board;
		var bs = $scope.game.boardSize;
		var row, col;
		//check rows
		for(row = 0; row < bs; row++) {
			for(col = 1; col < bs; col++) {
				if(b[row][col] === '' || b[row][col] !== b[row][col-1]) {
					break;
				}
				if(col == bs-1) {
					setWinner(b[row][col]);
					$scope.game.gameOver = true;
				}
			}
		}
		//check columns
		for(col = 0; col < bs; col++) {
			for( row = 1; row < bs; row++) {
				if(b[row][col] === '' || b[row][col] !== b[row-1][col]) {
					break;
				}
				if (row == bs-1) {
					setWinner(b[row][col]);
					$scope.game.gameOver = true;
				}
			}
		}
		//check diagonals
		for(var i = 1; i < bs; i++) {
			if(b[0][0] === '' || b[i][i] !== b[0][0]) {
				break;
			}
			if(i == (bs-1)) {
				setWinner(b[0][0]);
				$scope.game.gameOver = true;
			}
		}
		for(i = 0; i < bs; i++) {
			if(b[0][bs-1] === '' || b[i][bs-1-i] !== b[0][bs-1]) {
				break;
			}
			if(i == (bs-1)) {
				setWinner(b[0][bs-1]);
				$scope.game.gameOver = true;
			}
		}
		//if we've reached this point, there is no WIN, so check if gameboard is full
		//and return if not
		for(i = 0; i < bs; i++) {
			for(j = 0; j < bs; j++) {
				if(b[i][j] === '') return;
			}
		}
		//if we reach this point it's a tie
		$scope.game.gameOver = true;
		setWinner('XO');
	}

	 /* CHATS SECTION *******************************************************************/

	$scope.chats = getChats();
	$scope.showChat = false;
	$scope.chatsRead = 0;
	$scope.enterChat = '';

	// Get chats array from firebase
	function getChats() {
		var ref = new Firebase("https://rami-ttt.firebaseio.com/mariottt/chats/" + $scope.matchID);
		return $firebase(ref).$asArray();
	}

	// Send chat.  Triggered by chat form submit
	$scope.sendChat = function() {
		var sender = '';
		if($scope.user == $scope.game.playerOne) sender = 'mario';
		else sender = 'luigi';

		if($scope.chats.length >= 10) {
			$scope.chats.$remove(0);
		}

		if($scope.enterChat.length > 0) {
			$scope.chats.$add({sender: sender, message: $scope.enterChat});
			$scope.enterChat = '';
		}
	};

}]);