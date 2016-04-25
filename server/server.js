var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');

require('./config/middleware')(app, express);

// Gameboard controls
var game = require('./gameController.js');

var port = 8080;

// Lobby Data
var numPlayers = 0;
var numReadyPlayers = 0;
var players = [];
var gameStarted = false;

// Socket event listeners
io.on('connection', function (socket) {
	console.log('Socket connection has been established');

	var addedPlayer = false;
	var gameReady = false;
	var whosNext = '';

	socket.on('add user', function (user) {
		socket.username = user.name;
		players.push(user);
		numPlayers++;
		addedPlayer = true;
		io.sockets.emit('user join', {
			numPlayers: numPlayers,
			players: players
		});
	});

	socket.on('update', function () {
		console.log('Updating sockets for all users');
		io.sockets.emit('server update', {
			numPlayers: numPlayers,
			numReadyPlayers: numReadyPlayers,
			players: players,
			gameStatus: gameReady
		});
	});

	socket.on('status change', function () {
		players.forEach(function (player) {
			if (player.name === socket.username) {
				if (player.status === "ready") {
					player.status = "not ready";
					numReadyPlayers--;
				} else {
					player.status = "ready";
					numReadyPlayers++;
				}
			}
		});
		if (numReadyPlayers >= 2) {
			gameReady = true;
		}
		io.sockets.emit('server update', {
			numPlayers: numPlayers,
			numReadyPlayers: numReadyPlayers,
			players: players,
			gameStatus: gameReady
		});
	});

	socket.on('game start', function (startingUser) {
		io.sockets.emit('game started', {
			players: players,
			firstPlayer: startingUser
		});
	});

	socket.on('made move', function (data) {
		if (data.player === 'X') {
			whosNext = 'O';
		} else if (data.player === 'O') {
			whosNext = 'X';
		};

		if (!game.checkForWinner(data.gameBoard, data.player)) {
			io.sockets.emit('game update', {
				gameBoard: data.gameBoard,
				player: data.player,
				whosNext: whosNext
			});
		} else {
			io.sockets.emit('found winner', data.player)
		}
		
		if (game.checkCatsGame(data.gameBoard)) {
			io.sockets.emit('cats game');
		};
		 
	});
});



http.listen(port, function () {
	console.log("Server initialized on port: ", port);
});

