angular.module('TicTacToe.home', ['TicTacToe.services'])

.controller('HomeController', function ($scope, $rootScope, $window, $location, socket, HomeFactory) {
	
	$scope.currentUserName = '';
	$scope.currentUser = {};
	$scope.currentUser.status = "not ready";

	$rootScope.allPlayers = [];
	$scope.numPlayers = 0;
	$scope.numReadyPlayers = 0;
	$scope.gameStatus = false;

	var joinedAlready = false;

	/* Handle new users ready to play */
	$scope.signUp = function () {
		if (!joinedAlready) {
			$scope.currentUser.name = $scope.currentUserName;
			socket.emit('add user', $scope.currentUser);
			$window.localStorage.setItem('currentUserName', $scope.currentUserName);
			$scope.update();
			joinedAlready = true;
		} else {
			console.error('You have already joined');
		}
	};

	/* Handle server updates, and game start */
	$scope.update = function () {
		socket.emit('update');
	};

	$scope.statusChange = function () {
		socket.emit('status change');
	};

	$scope.startGame = function () {
		if ($scope.numReadyPlayers >= 2) {
			socket.emit('game start', $scope.currentUserName);
		} else {
			console.error('Not enough players to start');
		}
	};

	$scope.toGame = function () {
		$location.path('/gamestart');
	};

	/* Socket event listeners */
	socket.on('user join', function (data) {
		$rootScope.allPlayers = data.players;
		$scope.numPlayers = data.numPlayers;
	});

	socket.on('server update', function (data) {
		$rootScope.allPlayers = data.players;
		$scope.numPlayers = data.numPlayers;
		$scope.numReadyPlayers = data.numReadyPlayers;
		$scope.gameStatus = data.gameStatus;
	});

	socket.on('game started', function (data) {
		$rootScope.firstPlayer = data.firstPlayer;
		$scope.toGame();
	});

	$scope.update();
})

.factory('HomeFactory', function ($http) {

	var findPlayers = function () {
		return $http({
			method: 'GET',
			url: '/players/all'
		}).then(function (players) {
			console.log('players were retrieved')
		}).catch(function (err) {
			console.error('An error occured fetching other players', err);
		});
	};

	return {
		findPlayers: findPlayers
	};
});	