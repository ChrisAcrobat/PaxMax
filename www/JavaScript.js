'use strict'

// Pseudo-constants
const CELL_SIZE = 70;
const BOARD_SIZE_X = 5;
const BOARD_SIZE_Y = 9;

class Side{
	constructor(color=""){
		this.colorString = color;
	}
}
class PieceClass{
	constructor(name="", reachStraight=0, reachDiagonally=0){
		this.name = name;
		this.reachStraight = reachStraight;
		this.reachDiagonally = reachDiagonally;
	}
}
class Piece{
	constructor(piece=new PieceClass(), side=new Side(), position=new Position()){
		this.piece = piece;
		this.side = side;
		this.position = position;
	}
}

// Global variables
var animationStack = undefined;
var elementCanvas = undefined;
var canvasContext = undefined;
var colorWhite = undefined;
var colorBlack = undefined;
var tokenKing = undefined;
var tokenQueen = undefined;
var players = new Array();
var pieces = new Array();
function onload(){
	// Init
	animationStack = new AnimationStack();
	elementCanvas = document.getElementById('canvas');
	canvasContext = elementCanvas.getContext('2d');
	colorWhite = new Color('#FFF');
	colorBlack = new Color('#000');

	let sideRed = new Side("Red");
	players.push(sideRed);
	let sideYellow = new Side("Yellow");
	players.push(sideYellow);

	let classKing = new PieceClass("King", 2, 1);
	let classQueen = new PieceClass("Queen", 4, 3);
	pieces.push(new Piece(classKing, sideRed, new Position(2, BOARD_SIZE_Y)));
	pieces.push(new Piece(classQueen, sideRed, new Position(4, BOARD_SIZE_Y)));
	pieces.push(new Piece(classKing, sideYellow, new Position(1, 1)));
	pieces.push(new Piece(classQueen, sideYellow, new Position(5, 1)));

	// Code
	elementCanvas.width = BOARD_SIZE_X*CELL_SIZE;
	elementCanvas.height = BOARD_SIZE_Y*CELL_SIZE;
	redrawBoard();
	elementCanvas.classList.remove('hidden');
	// TODO: On change: animationStack.add(redrawBoard);
}
function redrawBoard(){
	canvasContext.clearRect(0, 0, BOARD_SIZE_X*CELL_SIZE, BOARD_SIZE_Y*CELL_SIZE);
	for(let index_x = 0; index_x < BOARD_SIZE_X; index_x++){
		for(let index_y = 0; index_y < BOARD_SIZE_Y; index_y++){
			if((index_x+index_y)%2 == 0){
				canvasContext.fillStyle = colorBlack.toString();
			}
			else{
				canvasContext.fillStyle = colorWhite.toString();
			}
			canvasContext.fillRect(CELL_SIZE*index_x, CELL_SIZE*index_y, CELL_SIZE, CELL_SIZE);
		}
	}

	let baselineOffset = CELL_SIZE/10;
	canvasContext.font = CELL_SIZE+'px Arial';
	canvasContext.strokeStyle = colorBlack.toString();
	canvasContext.textAlign = 'center';
	canvasContext.textBaseline = 'middle';

	pieces.forEach(piece => {
		canvasContext.fillStyle = piece.side.colorString;
		let symbol = piece.piece.name.substr(0,1);
		canvasContext.fillText(symbol, (piece.position.X-.5)*CELL_SIZE, (piece.position.Y-.5)*CELL_SIZE + baselineOffset);
		canvasContext.strokeText(symbol, (piece.position.X-.5)*CELL_SIZE, (piece.position.Y-.5)*CELL_SIZE + baselineOffset);
	});
}