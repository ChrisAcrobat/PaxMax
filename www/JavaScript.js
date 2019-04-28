'use strict'

// Note-to-self
// K: 1d 2r
// Q: 3d 4r

// Pseudo-constants
const CELL_SIZE = 70;
const BOARD_SIZE_X = 5;
const BOARD_SIZE_Y = 9;

const COLOR_PLAYER_1 = 'Red';
const COLOR_PLAYER_2 = 'Yellow';

// Global variables
var animationStack = undefined;
var elementCanvas = undefined;
var canvasContext = undefined;
var colorWhite = undefined;
var colorBlack = undefined;
var tokenKing = undefined;
var tokenQueen = undefined;

function onload(){
	// Init
	animationStack = new AnimationStack();
	elementCanvas = document.getElementById('canvas');
	canvasContext = elementCanvas.getContext('2d');
	colorWhite = new Color('#FFF');
	colorBlack = new Color('#000');
	tokenKing = [new Position(4, BOARD_SIZE_Y), new Position(4, 1)];
	tokenQueen = [new Position(2, BOARD_SIZE_Y), new Position(2, 1)];

	// Code
	elementCanvas.width = BOARD_SIZE_X*CELL_SIZE;
	elementCanvas.height = BOARD_SIZE_Y*CELL_SIZE;
	elementCanvas.classList.remove('hidden');
	animationStack.add(redrawBoard);
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

	canvasContext.fillStyle = COLOR_PLAYER_1;
	canvasContext.fillText('K', (tokenKing[0].X-.5)*CELL_SIZE, (tokenKing[0].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('K', (tokenKing[0].X-.5)*CELL_SIZE, (tokenKing[0].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.fillText('Q', (tokenQueen[0].X-.5)*CELL_SIZE, (tokenQueen[0].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('Q', (tokenQueen[0].X-.5)*CELL_SIZE, (tokenQueen[0].Y-.5)*CELL_SIZE + baselineOffset);

	canvasContext.fillStyle = COLOR_PLAYER_2;
	canvasContext.fillText('K', (tokenKing[1].X-.5)*CELL_SIZE, (tokenKing[1].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('K', (tokenKing[1].X-.5)*CELL_SIZE, (tokenKing[1].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.fillText('Q', (tokenQueen[1].X-.5)*CELL_SIZE, (tokenQueen[1].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('Q', (tokenQueen[1].X-.5)*CELL_SIZE, (tokenQueen[1].Y-.5)*CELL_SIZE + baselineOffset);
}