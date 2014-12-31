angular
	.module('tttApp')
	.controller('LobbyController', ['$scope', '$firebase', function($scope, $firebase) {



	/********************* USERNAME SECTION **************************************/

	$scope.user = localStorage.mariotttUser;
	if(!$scope.user) {
		$scope.user = "user-" + Math.floor(Math.random()*9999);
		localStorage.mariotttUser = $scope.user;
	}

	// global stats
	$scope.stats = getStats();
	function getStats() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/mariottt/stats/");
		return $firebase(ref).$asObject();
	}


	/********************* MATCH SECTION *****************************************/

	// This variable will hold the match ID number (a number between 1 - 99999 used
	// to uniquely identify each game)
  $scope.matchID = '';

	// Get Array of all Matches on Firebase
  $scope.matches = getMatches();
  function getMatches() {
		var ref = new Firebase("https://rami-tictactoe.firebaseio.com/mariottt/matches/");
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
			localStorage.mariotttMatchID = Math.floor(Math.random()*99999);
		}
		else {
			localStorage.mariotttMatchID = id;
		}
		localStorage.mariotttSize = boardSize;
		joinGame();
	};

	// Helper function that assigns a random username if none was chosen
	// and then changes to game.html
	function joinGame() {
		location.href = 'game.html';
	}

}]);
