/*********************************************************
*  LobbyController - controller for the lobby page where
*	   users can choose a username and then either join
*    an existing game or create a new game
**********************************************************/
angular
	.module('tictactoeApp')
	.controller('LobbyController', ['$scope', '$firebase', function($scope, $firebase) {





/********************* USERNAME SECTION **************************************/

	// This variable will hold the players username (string)
	$scope.user = '';
	// Flag set to true when player selects username (for styling)
	$scope.newNameSelected = false;

	// Check localStorage for a previous username, and assign it to the user variable if present
	$scope.isReturnUser = localStorage.user ? true : false;
	if($scope.isReturnUser) $scope.user = localStorage.user;

	// Get list of all users from Firebase
	$scope.users = getUsers();
	function getUsers() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/users/");
		return $firebase(ref).$asObject();
	}

	// Function called by view when Random username button clicked
	// * Returns a username string in this format <adjective>-<animal>-<number>
	$scope.randomName = function() {
		var an = animals.toLowerCase().split(' ');
		var adj = adjectives.split(' ');
		var adjective = adj[Math.floor(Math.random()*adj.length)];
		var animal = an[Math.floor(Math.random()*an.length)];
		var number = Math.floor(Math.random()*100);
		return [adjective, animal, number].join('-');
	};

	// Function called by view when player submits username (clicks Set button)
	// * Saves username to localStorage (new & returning) and Firebase (new only)
	$scope.setUsername = function() {
		localStorage.user = $scope.chosenName;
		$scope.user = localStorage.user;
		$scope.newNameSelected = true;
		if($scope.user in $scope.users) {
			//do nothing
		}
		else {
			$scope.users[$scope.user] = {name: $scope.user, w: 0, l: 0, d: 0};
			$scope.users.$save();
		}
	};





/********************* MATCH SECTION *****************************************/

	// This variable will hold the match ID number (a number between 1 - 99999 used
	// to uniquely identify each game)
  $scope.matchID = '';

	// Get Array of all Matches on Firebase
  $scope.matches = getMatches();
  function getMatches() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/matches/");
		return $firebase(ref).$asArray();
	}

  // Function used as a filter for matches (used in ng-repeat in view)
  // * Returns true if a match needs a second player
  $scope.openMatches = function(match) {
  	if(match.needPlayerTwo && match.playerOne != $scope.user) {
			return true;
		}
		return false;
  };

  // Function called when user selects open game or clicks 'I'm ready button'
  // * Saves matchID and boardSize (both passed in as arguments) to localStorage
  // * and then joins the game (triggering a url change)
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

	// Helper function that assigns a random username if none was chosen
	// and then changes to game.html
	function joinGame() {
		if(!localStorage.user) localStorage.user = $scope.randomName();
		location.href = 'game.html';
	}

}]);
