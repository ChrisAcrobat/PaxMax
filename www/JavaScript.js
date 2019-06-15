'use strict'

// Pseudo-constants
const CELL_SIZE = 70;
const BOARD_SIZE_X = 5;
const BOARD_SIZE_Y = 9;

class Side{
	constructor(name='', color=new Color()){
		this.name = name;
		this.color = color;
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
	constructor(pieceClass=new PieceClass(), side=new Side(), position=new Position()){
		this.class = pieceClass;
		this.side = side;
		this.position = position;
		this.paxed = false;
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
var selectedToken = null;
var moveTimestamp = Date.now();
var possiblePositionColor = undefined;
function onload(){
	// Init
	animationStack = new AnimationStack();
	elementCanvas = document.getElementById('canvas');
	elementCanvas.onclick = mouseClick;
	canvasContext = elementCanvas.getContext('2d');
	colorWhite = new Color('#FFF');
	colorBlack = new Color('#000');
	possiblePositionColor = new Color('#0F0');

	let sideRed = new Side('Red', new Color('#F00'));
	players.push(sideRed);
	let sideYellow = new Side('Yellow', new Color('#FF0'));
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
function isPossiblePosition(piece=new piece(), newPos=new Position()){
	let c = piece.class;
	let pos = piece.position;

	// Check straight
	if((pos.X === newPos.X && pos.Y - c.reachStraight < newPos.Y && newPos.Y < pos.Y + c.reachStraight)
	|| (pos.Y === newPos.Y && pos.X - c.reachStraight < newPos.X && newPos.X < pos.X + c.reachStraight)){
		return true;
	}

	// Check diagonally
	let returnList = Array();
	returnList.push(new Position(pos.X - c.reachDiagonally, pos.Y + c.reachDiagonally));
	returnList.push(new Position(pos.X + c.reachDiagonally, pos.Y + c.reachDiagonally));
	returnList.push(new Position(pos.X + c.reachDiagonally, pos.Y - c.reachDiagonally));
	returnList.push(new Position(pos.X - c.reachDiagonally, pos.Y - c.reachDiagonally));
	return false;
}
function mouseClick(event){
	let pos = getEventPos(event);
	let x = Math.ceil(pos.X/CELL_SIZE);
	let y = Math.ceil(pos.Y/CELL_SIZE);
	let token = pieces.find(piece => piece.position.X === x && piece.position.Y === y);
	if(token === undefined){
		if(selectedToken !== null){
			let newPos = new Position(x, y);
			if(isPossiblePosition(selectedToken, newPos)){
				moveToken(newPos)
			}
		}
		selectedToken = null;
	}
	else{
		if(token.side === players[0]){
			selectedToken = token;
		}
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

	let now = Date.now();
	drawCheckerboard();
	drawPieces();
	drawHighlightedCells(now);

	animationStack.add(redrawBoard);
}
function drawCheckerboard(){
	canvasContext.lineWidth = 1;
	for(let index_x = 0; index_x < BOARD_SIZE_X; index_x++){
		for(let index_y = 0; index_y < BOARD_SIZE_Y; index_y++){
			if((index_x+index_y)%2 === 0){
				canvasContext.fillStyle = colorBlack.toString();
			}
			else{
				canvasContext.fillStyle = colorWhite.toString();
			}
			canvasContext.fillRect(CELL_SIZE*index_x, CELL_SIZE*index_y, CELL_SIZE, CELL_SIZE);
		}
	}
}
function moveToken(newPosition=new Position()){
	if(selectedToken !== null && selectedToken.side === players[0]){
		// TODO: Animate move.
		selectedToken.position.X = newPosition.X;
		selectedToken.position.Y = newPosition.Y;

		selectedToken = null;
		moveTimestamp = Date.now();
		players.push(players.shift());
	}
}
function drawPieces(){
	let baselineOffset = CELL_SIZE/10;
	canvasContext.font = CELL_SIZE+'px Arial';
	canvasContext.strokeStyle = colorBlack.toString();
	canvasContext.textAlign = 'center';
	canvasContext.textBaseline = 'middle';

	pieces.forEach(piece => {
		canvasContext.fillStyle = piece.side.color.toString();
		let symbol = piece.class.name.substr(0,1);
		canvasContext.fillText(symbol, (piece.position.X-.5)*CELL_SIZE, (piece.position.Y-.5)*CELL_SIZE + baselineOffset);
		canvasContext.strokeText(symbol, (piece.position.X-.5)*CELL_SIZE, (piece.position.Y-.5)*CELL_SIZE + baselineOffset);
	});

	canvasContext.font = Math.floor(CELL_SIZE/2)+'px Arial';
	canvasContext.save();
	pieces.forEach(piece => {
		if(piece.paxed){
			let x = (piece.position.X-.5)*CELL_SIZE;
			let y = (piece.position.Y-.5)*CELL_SIZE;

			canvasContext.fillStyle = (piece.side === players[0] ? players[1] : players[0]).color.toString();
			if((piece.position.X+piece.position.Y)%2 === 0){
				canvasContext.strokeStyle = 'white';
			}
			else{
				canvasContext.strokeStyle = 'black';
			}
			canvasContext.save();
			canvasContext.translate(x, y);
			canvasContext.rotate(-Math.PI / 4);
			canvasContext.fillText('Pax', 0, 0);
			canvasContext.strokeText('Pax', 0, 0);
			canvasContext.restore();
		}
	});
}
function drawHighlightedCells(now){
	let localList = highlightedCells.slice(0);
	if(selectedToken === null){
		pieces.forEach(piece => {
			if(piece.side === players[0]){
				localList.push([piece.position, piece.side.color, moveTimestamp]);
			}
		});
	}
	else if(selectedToken.side === players[0]){
		localList.push([selectedToken.position, selectedToken.side.color, moveTimestamp]);
		for(let index_x = 0; index_x < BOARD_SIZE_X; index_x++){
			for(let index_y = 0; index_y < BOARD_SIZE_Y; index_y++){
				let pos = new Position(index_x, index_y);
				if(isPossiblePosition(selectedToken, pos)){
					localList.push([pos, possiblePositionColor, moveTimestamp]);
				}
			}
		}
	}
	localList.forEach(highlight => {
		let cell = highlight[0];
		let color = new Color(highlight[1]);
		let flashFrom = highlight[2];
		let flashTimespan = flashFrom === undefined ? undefined : now - flashFrom;

		let halfWidth = 2.5;
		canvasContext.lineWidth = halfWidth*2;
		let cellPixelPos = new Position(CELL_SIZE*(cell.X-1), CELL_SIZE*(cell.Y-1));

		let rotate = false;
		if(rotate){	// TODO: Fix.
			let sides = [
				[new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + halfWidth), new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth)],
				[new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth), new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth)],
				[new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + CELL_SIZE - halfWidth), new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + halfWidth)],
				[new Position(cellPixelPos.X + CELL_SIZE - halfWidth, cellPixelPos.Y + halfWidth), new Position(cellPixelPos.X + halfWidth, cellPixelPos.Y + halfWidth)]
			];

			sides.forEach((side, index) => {
				let offsetValue = CELL_SIZE*index;
				offsetValue = (flashTimespan/10)%CELL_SIZE + offsetValue;
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

			if(flashTimespan !== undefined){
				let min = 64;
				let max = 190;
			//	let nowSlow = now/10;
			//	let offsetValue = Math.abs((nowSlow%512)-256)*(max/256) + 256*(min/256);
				let offsetValue = min + (max-min)*Math.abs(Math.sin(flashTimespan/1500));
				color.A = offsetValue;
			}
			canvasContext.strokeStyle = color.toRGBAString();
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