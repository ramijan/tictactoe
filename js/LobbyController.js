angular
	.module('tttApp')
	.controller('LobbyController', ['$scope', '$firebase', function($scope, $firebase) {


	// (String) user id used to track different players
	$scope.user = getUserID();
	// (Object) contains total Mario/Luigi wins across all players and games
	$scope.stats = getStats();
	// (Array) contains all matches that are saved on Firebase
  $scope.matches = getMatches();

  // Gets existing user ID or generates a new one and then saves it to localStorage and returns it
	function getUserID() {
		localStorage.mariotttUser = (localStorage.mariotttUser || "user-" + Math.floor(Math.random()*9999));
		return localStorage.mariotttUser;
	}

	// Gets mario/luigi wins stats from Firebase and returns the object
	function getStats() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/mariottt/stats/");
		return $firebase(ref).$asObject();
	}

	// Gets all matches from Firebase and returns the array
  function getMatches() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/mariottt/matches/");
		return $firebase(ref).$asArray();
	}

  // Filter function for ng-repeat on index.html. Used to pull out only the open matches from the matches array
  $scope.openMatches = function(match) {
		return match.needPlayerTwo && match.playerOne != $scope.user;
  };

  // Called when user picks a game to join or starts a new game
  // Saves matchID and boardSize to localStorage and then joins the game (triggering a url change)
	$scope.setMatchIdAndBoard = function(id, boardSize) {
		localStorage.mariotttMatchID = (id == 'new' ? randomHex(16) + '-' + randomHex(16) : id);
		localStorage.mariotttSize = boardSize;
		joinGame();
	};

	// Helper function.  Returns a random hex number (string) in the range 0 <= number < n
	function randomHex(n) {
		return Math.floor(Math.random() * n).toString(16).toUpperCase();
	}

	// Helper function to launch game page.  Called in setMatchIdAndBoard function
	function joinGame() {
		location.href = 'game.html';
	}

}]);