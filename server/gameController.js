var gameBoard = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]]


var checkForWinner = function (gameBoard, target) {

	var foundWinner = false;

	for (var i=0; i < gameBoard.length; i++) {
		//Handles horizontals	
		if (gameBoard[i][0] === target && gameBoard[i][1] === target && gameBoard[i][2] === target) {
			foundWinner = true;
		}
		//Handles verticals
		if (gameBoard[0][i] === target && gameBoard[1][i] === target && gameBoard[2][i] === target) {
			foundWinner = true;
		}
		//Handles diagonal pieces
		if (gameBoard[0][0] === target && gameBoard[1][1] === target && gameBoard[2][2] === target) {
			foundWinner = true;
		}
		if (gameBoard[0][2] === target && gameBoard[1][1] === target && gameBoard[2][0] === target) {
			foundWinner = true;
		}
	};
	return foundWinner;
};

var checkCatsGame = function (gameBoard) {
	var catsGame = true;
	for (var i=0; i < gameBoard.length; i++) {
		for (var j=0; j < gameBoard[i].length; j++) {
			if (gameBoard[j][i] === 0) {
				catsGame = false;
			}
		}
	}
	return catsGame;
};

module.exports = {
	gameBoard: gameBoard,
	checkForWinner: checkForWinner,
	checkCatsGame: checkCatsGame
};
