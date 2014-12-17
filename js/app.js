var app = angular.module('tictactoeApp', ['firebase']);


/*
*
*		MenuController handles the menu page
*
*/
app.controller('MenuController', ['$scope', '$firebase', function($scope, $firebase) {

	$scope.user = '';
	$scope.matchID = '';

// USERNAME STUFF
	$scope.isReturnUser = localStorage.user ? true : false;
	if($scope.isReturnUser) $scope.user = localStorage.user;

	$scope.newNameSelected = false;


	$scope.randomName = function() {
		var an = animals.toLowerCase().split(' ');
		var adj = adjectives.split(' ');
		var adjective = adj[Math.floor(Math.random()*adj.length)];
		var animal = an[Math.floor(Math.random()*an.length)];
		var number = Math.floor(Math.random()*100);
		return [adjective, animal, number].join('-');
	};

	$scope.setUsername = function() {
		localStorage.user = $scope.chosenName;
		$scope.user = localStorage.user;
		$scope.newNameSelected = true;
		console.log("User changed to: " + localStorage.user);
	};
//////////

//MATCHID STUFF
  $scope.matches = $firebase(new Firebase("https://rami-tictactoe.firebaseio.com/matches/")).$asArray();
  
  $scope.openMatches = function(match) {
  	if(match.needPlayerTwo && match.playerOne != $scope.user) {
			return true;
		}
		return false;
  };


	$scope.setMatchIdAndBoard = function(id, boardSize) {
		if(id=='new') {
			localStorage.matchID = Math.floor(Math.random()*99999);
		}
		else {
			localStorage.matchID = id;
		}
		localStorage.boardSize = boardSize;
		joinGame();
	};

	function joinGame() {
		if(!localStorage.user) localStorage.user = $scope.randomName();
		location.href = 'game.html';

	}

// End of MenuController
}]);



/*
*
*		MainController handles the game page
*
*/

app.controller('MainController', ['$scope', '$firebase', function($scope, $firebase) {

	$scope.user = localStorage.user;
	$scope.matchID = localStorage.matchID;
	$scope.boardSize = localStorage.boardSize;


	console.log('username: ' + $scope.user + ' & matchid: ' + $scope.matchID);

	var matchSync = $firebase(new Firebase("https://rami-tictactoe.firebaseio.com/matches/" + $scope.matchID));
	var matchObj = matchSync.$asObject();
	matchObj.$bindTo($scope, 'game');

	matchObj.$loaded().then(function() {
		console.log(Object.keys(matchObj));
		console.log('needPlayerTwo present: ' + ('needPlayerTwo' in matchObj));

		if('needPlayerTwo' in matchObj && 'playerOne' in matchObj && $scope.game.playerOne != $scope.user) {
			matchSync.$update({needPlayerTwo: false, playerTwo: $scope.user});
		}
		else if(('playerOne' in matchObj) && $scope.game.playerOne == $scope.user) {
			//do nothing, but skip the else clause
		}
		else {
			var newgame = new Game();
			matchSync.$set(newgame);
		}

		//if game already existed and chosen board size doesn't match game,
		// then change to size on existing game
		if($scope.game.boardSize != $scope.boardSize) {
			$scope.boardSize = $scope.game.boardSize;
		}

	});

	function Game() {
		this.boardSize = $scope.boardSize;
		this.board = createBoard($scope.boardSize);
		this.playerOne = $scope.user;
		this.playerTwo = '';
		this.needPlayerTwo = true;
		this.playerOneTurn = true;
		this.gameOver = false;

	}

	function createBoard(size) {
		var board = {};
		for(var i = 0; i < size; i++) {
			board[i] = {};
			for(var j = 0; j < size; j++) {
				board[i][j] = '';
			}
		}
		return board;
	}

	$scope.getBoardSizeArray = function() {

			var arr = [];
			for(var i = 0; i < $scope.game.boardSize; i++) {
				arr.push(i);
			}
			return arr;
	};


	$scope.resetBoard = function() {
		var p1 = $scope.game.playerOne;
		var p2 = $scope.game.playerTwo;
		matchSync.$set(new Game()).then(function(){
			$scope.game.playerOne = p2;
			$scope.game.playerTwo = p1;
			$scope.game.needPlayerTwo = false;
		});

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

	$scope.isGameOver = function() {
		var b = $scope.game.board;

		//check rows
		for(var i = 0; i < b.length; i++) {
			if(b[i][0] && b[i][1] && b[i][2] && b[i][0] == b[i][1] && b[i][1] == b[i][2]) {
				$scope.game.gameOver = true;
				console.log($scope.game.gameOver);
				return b[i][0];
			}
		}
		//check columns
		for(var j = 0; j < b[0].length; j++) {
			if(b[0][j] && b[1][j] && b[2][j] && b[0][j] == b[1][j] && b[1][j] == b[2][j]) {
				$scope.game.gameOver = true;
				return b[0][j];
			}
		}
		//check diagonals
		if(b[0][0] && b[1][1] && b[2][2] && b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
			$scope.game.gameOver = true;
			return b[0][0];
		}
		if(b[0][2] && b[1][1] && b[2][0] && b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
			$scope.game.gameOver = true;
			return b[0][2];
		}
		console.log(b.length);
		//check tie (and game not complete)
		for(i = 0; i < b.length; i++) {
			for(j = 0; j < b[i].length; j++) {
				if(b[i][j] === '') return;
			}
		}
		$scope.game.gameOver = true;
		return 'XO';
	};

	$scope.exit = function() {

		// if($scope.game.playerOne == $scope.user){
		// 	$scope.game.playerOne = '';
		// }
		// else if ($scope.game.playerTwo == $scope.user){
		// 	$scope.game.playerTwo = '';
		// }

		// if(!$scope.game.playerOne && !$scope.game.playerTwo) {
		// 	console.log('game should delete');
		// 	matchObj.$remove();
		// }
		matchObj.$remove();
	};



}]);

