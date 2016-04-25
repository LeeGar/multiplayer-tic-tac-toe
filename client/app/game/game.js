angular.module('TicTacToe.game', [])

.controller('GameController', function ($scope, $rootScope, $window, $location, socket) {
	
	$scope.currentUserName = $window.localStorage.getItem('currentUserName');

	var first = 'X';
	var second = 'O';
	var winner = null;

	$scope.whosNext = 'X';

	$scope.gameBoard = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]]

	var cell = function (row, column) {
		return $scope.gameBoard[row][column]
	};

	$scope.cellClass = function (row, column) {
		var value = cell(row, column);
		return 'cell cell-' + value
	};

	$scope.cellText = function (row, column) {
		var value = cell(row, column);
		return value ? value : ' '
	};

	$scope.checkTurn = function () {
		if ($rootScope.firstPlayer === $scope.currentUserName) {
			firstPlayersTurn = true;
		}
	};

	$scope.redirectUser = function () {
		$location.path('/home')
	};

	/* Logic for setting pieces based on turn */
	$scope.setPiece = function (row, column, value) {
		if ($rootScope.firstPlayer === $scope.currentUserName) {
			if ($scope.whosNext === 'X') {
				$scope.gameBoard[row][column] = first;
				socket.emit('made move', {gameBoard: $scope.gameBoard, player: first});	
			} else {
				console.error('Not your turn 1st player');
			}
		} else if ($rootScope.firstPlayer !== $scope.currentUserName) {
			if ($scope.whosNext === 'O') {
				$scope.gameBoard[row][column] = second;
				socket.emit('made move', {gameBoard: $scope.gameBoard, player: second});			
			} else {
				console.error('Not your turn 2nd player');
			}
		} else {
			console.error("An error occured!")
		}
	};

	/* Socket event listeners for game */
	socket.on('game update', function (data) {
		$scope.gameBoard = data.gameBoard;
		$scope.whosNext = data.whosNext;
	});

	socket.on('cats game', function () {
		alert('Sorry! Everybody wins :)')
		$location.path('/gameover');
	});

	socket.on('found winner', function (data) {
		if (data === 'X') {
			alert('Congratulations, ' + $rootScope.firstPlayer);
		} else {
			alert('Congratulations, ' + $scope.currentUserName);
		};
		$location.path('/gameover');
	});


})