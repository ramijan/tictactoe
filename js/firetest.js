var app = angular.module('tictactoeApp', ['firebase']);

app.controller('MainController', ['$scope', '$firebase', function($scope, $firebase) {


	if(!localStorage.user) {
		localStorage.user = 'Guest ' + Math.floor(Math.random() * 9999);
	}
	$scope.user = localStorage.user;
	console.log("User is: " + $scope.user);


	var matchID = '';
	$scope.matches = $firebase(new Firebase("https://rami-tictactoe.firebaseio.com/matches/")).$asObject();

	var ref, fb, syncObject, ng;


	var checkForGame = function() {
	$scope.matches.$loaded().then(function() {

   	angular.forEach($scope.matches, function(value, key) {
   		console.log(key, value);
      if(value.needPlayerTwo) {
      	value.playerTwo = $scope.user;
      	value.needPlayerTwo = false;
      	matchID = key;
      	return;
      }

    });
   	console.log('after finding match', matchID);

   	if(matchID == '') {
   		matchID = Math.floor(Math.random() * 9999);
   		ng = new Game();
   	}
   	console.log(ng);
   	console.log(matchID);


	  ref = new Firebase("https://rami-tictactoe.firebaseio.com/matches/" + matchID);
	  fb = $firebase(ref);
	  syncObject = fb.$asObject();
		syncObject.$bindTo($scope, 'game');

		if(ng) {
			fb.$set(ng);
		}



	  });
	};

	checkForGame();

	function Game() {
		this.board = {0:{0:0, 1:0, 2:0},1:{0:0, 1:0, 2:0},2:{0:0, 1:0, 2:0}}
		this.playerOne = $scope.user;
		this.playerTwo = '';
		this.needPlayerTwo = true;
	}

	$scope.resetBoard = function() {
		var p2 = $scope.game.playerTwo;
		console.log(p2)
		ng = new Game();
		ng.playerTwo = p2;
		fb.$set(ng);

	};


	$scope.playerOneTurn = true;

	$scope.play = function(row, column) {
		if($scope.game.board[row][column] == 0) {
			$scope.game.board[row][column] = $scope.playerOneTurn ? 'X' : 'O';
			$scope.playerOneTurn = !$scope.playerOneTurn;
		}
	};





}]);
