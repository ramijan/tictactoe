function Match() {
	this.playerOne = {};
	this.playerTwo = {};
	this.currentGame = {};
	this.waitingForOpponent = false;
	this.matchHistory = [];
}

function Player(username) {
	this.username = username;
	this.loggedIn = false;
	this.record = [];
}

//this will live on firebase
var matches = [
		//list active match objects

];

// This will live on firebase 
var users = {
		//username: person object

};


var $scope = {};
$scope.user = {};
$scope.match = {};


function login(username) {

	//check if user is already logged in somewhere else
	if(users[username] && users[username].loggedIn) {
		// Alert User that username is already logged in
    console.log("already logged in");
		return;
	}

	//check if user already exists
	if(users[username]) {
		$scope.user = users[username];
		$scope.user.loggedIn = true;
	}	
	//if username doesn't exist, make new account
	else {
		$scope.user = new Player(username);
		$scope.user.loggedIn = true;
		users[username] = $scope.user;
	}
}

/*
	Pseudocode for logout

	//IF FIRST TO LOG OUT
	If user is player one
		make second player into player one
	
	set second player to empty
	reset current game
	set loggedIn flag to false
	set $scope.user to null
	set searching for opponent to true
	set $scope.match to null

	//IF SECOND TO LOG OUT
	set loggedIn flag to false
	set $scope.user to null
	delete match from matches array


*/

function logout() {
	//if first to logout
	if($scope.match.playerOne && $scope.match.playerTwo) {

		if($scope.match.playerOne == $scope.user) {
			$scope.match.playerOne = $scope.match.playerTwo;
		}
		$scope.match.playerTwo = null;
		$scope.match.currentGame = null;  // not sure what to set this at right now

		$scope.user.loggedIn = false;
		$scope.user = null;
		$scope.match.waitingForOpponent = true;
		$scope.match = null;
	}
	//if second to logout
	else {
		$scope.user.loggedIn = false;
		$scope.user = null;
		var i = matches.indexOf($scope.match);
		matches.splice(i, 1);

	}
}


function findMatch() {
	
	//check matches for open match and jump in as player two if one exists
	for(var i = 0; i < matches.length; i++) {
		if(matches[i].waitingForOpponent) {
			$scope.match = matches[i];
			$scope.match.playerTwo = $scope.user;
			$scope.match.waitingForOpponent = false;
			return;
		}
	}

	// if no open matches exist, create a new match and jump in as player one
	var match = new Match();
	match.playerOne = $scope.user;
	match.waitingForOpponent = true;
	matches.push(match);
  $scope.match = match;

}

console.log('hi');
