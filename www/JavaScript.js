'use strict'

// Pseudo-constants
const CELL_SIZE = 70;
const BOARD_SIZE_X = 5;
const BOARD_SIZE_Y = 9;

class Side{
	constructor(color=''){
		this.colorString = color;
	}
}
class PieceClass{
	constructor(name='', reachStraight=0, reachDiagonally=0){
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
var highlightedCells = new Array();
function onload(){
	// Init
	animationStack = new AnimationStack();
	elementCanvas = document.getElementById('canvas');
	elementCanvas.onmousemove = moveEvent;
	canvasContext = elementCanvas.getContext('2d');
	colorWhite = new Color('#FFF');
	colorBlack = new Color('#000');

	let sideRed = new Side('Red');
	players.push(sideRed);
	let sideYellow = new Side('Yellow');
	players.push(sideYellow);

	let classKing = new PieceClass('King', 2, 1);
	let classQueen = new PieceClass('Queen', 4, 3);
	pieces.push(new Piece(classKing, sideRed, new Position(2, BOARD_SIZE_Y)));
	pieces.push(new Piece(classQueen, sideRed, new Position(4, BOARD_SIZE_Y)));
	pieces.push(new Piece(classKing, sideYellow, new Position(1, 1)));
	pieces.push(new Piece(classQueen, sideYellow, new Position(5, 1)));

	// Code
	elementCanvas.width = BOARD_SIZE_X*CELL_SIZE;
	elementCanvas.height = BOARD_SIZE_Y*CELL_SIZE;
	redrawBoard();
	elementCanvas.classList.remove('hidden');
}
function moveEvent(event){
	let pos = getEventPos(event);
	let x = Math.ceil(pos.X/CELL_SIZE);
	let y = Math.ceil(pos.Y/CELL_SIZE);
	if(0 < x && x <= BOARD_SIZE_X && 0 < y && y <= BOARD_SIZE_Y){
		let cell = new Position(x, y);
		highlightedCells = new Array();	// TEMP
		highlightedCells.push(cell);
	}
}
function getEventPos(event, raw=false){
	if(raw){return new Position(event.offsetX, event.offsetY);}

	let x = undefined;
	let y = undefined;

	if(event.touches === undefined){
		x = event.offsetX;
		y = event.offsetY;
	}
	else{
		let dx = 0;
		let dy = 0;
		let length = event.touches.length;
		for(let index = 0; index < length; index++){
			let touch = event.touches[index];
			dx += touch.offsetX;
			dy += touch.offsetY;
		}

		x = dx/length;
		y = dy/length;
	}

	return new Position(x, y);
}
function redrawBoard(){
	canvasContext.clearRect(0, 0, BOARD_SIZE_X*CELL_SIZE, BOARD_SIZE_Y*CELL_SIZE);

	drawCheckerboard();
	drawPieces();
	drawHighlightedCells();

	animationStack.add(redrawBoard);
}
function drawCheckerboard(){
	canvasContext.lineWidth = 1;
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
}
function drawPieces(){
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
function drawHighlightedCells(){
	let now = Date.now();
	highlightedCells.forEach(cell => {
		let halfWidth = 2.5;
		canvasContext.lineWidth = halfWidth*2;
		let cellPixelPos = new Position(CELL_SIZE*(cell.X-1), CELL_SIZE*(cell.Y-1));

		let rotate = false;
		if(rotate){
			let sides = [
				[new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + halfWidth), new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth)],
				[new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth), new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth)],
				[new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth), new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + halfWidth)],
				[new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + halfWidth), new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + halfWidth)]
			];

			sides.forEach((side, index) => {
				let offsetValue = CELL_SIZE*index;
				offsetValue = (now/10)%CELL_SIZE + offsetValue;
				var gradient = canvasContext.createLinearGradient(side[0].X + offsetValue, side[0].Y + offsetValue, side[1].X - offsetValue, side[1].Y - offsetValue);
				gradient.addColorStop(0, 'Red');
				gradient.addColorStop(1, 'Transparent');
		
				canvasContext.strokeStyle = gradient;
				canvasContext.beginPath();
				canvasContext.moveTo(side[0].X, side[0].Y);
				canvasContext.lineTo(side[1].X, side[1].Y);
				canvasContext.stroke();
			});
		}
		else{
			let sidePos = [
				new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + halfWidth),
				new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth),
				new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth),
				new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + halfWidth)
			];

			let nowSlow = now/10;
			let offsetValue = parseInt(Math.abs((nowSlow%512)-256))/256;
			canvasContext.strokeStyle = 'rgba(255,0,0,' + offsetValue + ')';
			canvasContext.beginPath();
			let startPos = sidePos[3];
			canvasContext.moveTo(startPos.X, startPos.Y);
			sidePos.forEach(position => {
				canvasContext.lineTo(position.X, position.Y);
			});
			canvasContext.closePath();
			canvasContext.stroke();
		}
	});
}