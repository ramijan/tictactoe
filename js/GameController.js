/******************************************************************************
*
*		GameController handles the game page
*
******************************************************************************/
angular
	.module('tictactoeApp')
	.controller('GameController', ['$scope', '$firebase', function($scope, $firebase) {

	 // Make sure all the localStorage info is present and send user back to menu if not 
	if(!localStorage.matchID || !localStorage.boardSize || !localStorage.user) {
		alert('something went wrong. going back to menu');
		location.href="index.html";
	}
	// Save the localStorage data to the $scope
	$scope.user = localStorage.user;
	$scope.matchID = localStorage.matchID;
	$scope.boardSize = localStorage.boardSize;


	console.log('username: ' + $scope.user + ' & matchid: ' + $scope.matchID);

//BEGINNING OF SWITCHING OVER TO NICER STYLE
	$scope.matches = getMatches();
	function getMatches() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/matches/");
		return $firebase(ref).$asObject();
	}

	function getMatch() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/matches/" + $scope.matchID);
		return $firebase(ref).$asObject();
	}


	$scope.userObj = getUser($scope.user);
	function getUser(user) {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/users/" + user);
		return $firebase(ref).$asObject();
	}

	$scope.users = getUsers();
	function getUsers() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/users/");
		return $firebase(ref).$asArray();
	}


	var matchSync = $firebase(new Firebase("https://rami-tictactoe.firebaseio.com/matches/" + $scope.matchID));
	var matchObj = matchSync.$asObject();
	matchObj.$bindTo($scope, 'game');

	matchObj.$loaded().then(function() {
		angular.forEach(matchObj, function(v, k){console.log(k, v);});
		console.log('needPlayerTwo present: ' + ('needPlayerTwo' in matchObj));

		if('needPlayerTwo' in matchObj && 'playerOne' in matchObj && $scope.game.playerOne != $scope.user) {
			$scope.game.needPlayerTwo = false;
			$scope.game.playerTwo = $scope.user;
		}
		else if(('playerOne' in matchObj) && $scope.game.playerOne == $scope.user) {
			//do nothing, but skip the else clause
		}
		else {
			var newgame = new Game();
			matchSync.$set(newgame);
		}
	});

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
	$scope.getBoardSizeArray = function() {
			var arr = [];
			for(var i = 0; i < boardArraySize; i++) {
				arr.push(i);
			}
			return arr;
	};


	$scope.resetBoard = function() {

		$scope.game.board = createBoard($scope.game.boardSize);
		$scope.game.playerOneTurn = !$scope.game.playerOneStarts;
		$scope.game.playerOneStarts = !$scope.game.playerOneStarts;
		$scope.game.gameOver = false;
		$scope.game.winner = '';

	};


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
		$scope.isGameOver();
	};

	function setWinner(token) {
		//set winner property
		if(token == 'XO') {
			$scope.game.winner = 'tie';
			$scope.userObj.d += 1;
		}
		else if(token == 'X') {
			$scope.game.winner = $scope.game.playerOne;
			$scope.game.playerOneWins += 1;
			if($scope.userObj.name == $scope.game.playerOne) {
				$scope.userObj.w += 1;
			}
			else {
				$scope.userObj.l += 1;
			}
		}
		else if(token == 'O') {
			$scope.game.winner = $scope.game.playerTwo;
			$scope.game.playerTwoWins += 1;
			if($scope.userObj.name == $scope.game.playerTwo) {
				$scope.userObj.w += 1;
			}
			else {
				$scope.userObj.l += 1;
			}
		}
		$scope.userObj.$save();

	}

	$scope.isGameOver = function() {
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
	};

	$scope.exit = function() {
		console.log('in exit');
		if($scope.game.playerTwo === '') {
			console.log('only one player');
			$scope.game.remove();
		} 
		else if($scope.game.playerOne == $scope.user) {
			$scope.game.playerOne = $scope.game.playerTwo;
			$scope.game.playerTwo = '';
			$scope.game.needPlayerTwo = true;
			console.log("player 1 left the game.");
		}
		else {
			$scope.game.needPlayerTwo = true;
			console.log('player 2 left the game');
		}
		//location.href="index.html";


	};

	/* CHATS SECTION *******************************************************************/

	$scope.chats = getChats();
	function getChats() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/chats/" + $scope.matchID);
		return $firebase(ref).$asArray();
	}

	$scope.showChat = false;
	$scope.chatsRead = 0;
	$scope.enterChat = '';

	$scope.sendChat = function() {
		if($scope.enterChat.length > 0) {
			$scope.chats.$add({sender: $scope.user, message: $scope.enterChat});
			$scope.enterChat = '';
		}
	};


}]);