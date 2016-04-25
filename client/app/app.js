angular.module('TicTacToe', [
	'TicTacToe.services',
	'TicTacToe.home',
	'TicTacToe.game',
	'ngRoute'
])

.config(function ($routeProvider) {

	$routeProvider
	.when('/home', {
		templateUrl: 'app/home/home.html',
		controller: 'HomeController'
	})
	.when('/gamestart', {
		templateUrl: 'app/game/gamestart.html',
		controller: 'GameController'
	})
	.when('/gameover', {
		templateUrl: 'app/game/gameover.html',
		controller: 'GameController'
	})
	.otherwise({
		redirectTo: '/home'
	});

});


