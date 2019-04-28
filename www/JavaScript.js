'use strict'

// Note-to-self
// K: 1d 2r
// Q: 3d 4r

// Pseudo-constants
const CELL_SIZE = 70;
const BOARD_SIZE_X = 5;
const BOARD_SIZE_Y = 9;
const COLOR_WHITE = new Color('#FFF');
const COLOR_BLACK = new Color('#000');
const TOKEN_KING = [new Position(4, BOARD_SIZE_Y), new Position(4, 1)];
const TOKEN_QUEEN = [new Position(2, BOARD_SIZE_Y), new Position(2, 1)];

const COLOR_PLAYER_1 = 'Red';
const COLOR_PLAYER_2 = 'Yellow';

// Global variables
var elementCanvas = undefined;
var canvasContext = undefined;

function onload(){
	// Init
	elementCanvas = document.getElementById('canvas');
	canvasContext = elementCanvas.getContext('2d');

	// Code
	elementCanvas.width = BOARD_SIZE_X*CELL_SIZE;
	elementCanvas.height = BOARD_SIZE_Y*CELL_SIZE;
	redrawBoard();
}

function redrawBoard(){
	canvasContext.clearRect(0, 0, BOARD_SIZE_X*CELL_SIZE, BOARD_SIZE_Y*CELL_SIZE);
	for(let index_x = 0; index_x < BOARD_SIZE_X; index_x++){
		for(let index_y = 0; index_y < BOARD_SIZE_Y; index_y++){
			if((index_x+index_y)%2 == 0){
				canvasContext.fillStyle = COLOR_BLACK.toString();
			}
			else{
				canvasContext.fillStyle = COLOR_WHITE.toString();
			}
			canvasContext.fillRect(CELL_SIZE*index_x, CELL_SIZE*index_y, CELL_SIZE, CELL_SIZE);
		}
	}

	let baselineOffset = CELL_SIZE/10;
	canvasContext.font = CELL_SIZE+'px Arial';
	canvasContext.strokeStyle = COLOR_BLACK.toString();
	canvasContext.textAlign = 'center';
	canvasContext.textBaseline = 'middle';

	canvasContext.fillStyle = COLOR_PLAYER_1;
	canvasContext.fillText('K', (TOKEN_KING[0].X-.5)*CELL_SIZE, (TOKEN_KING[0].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('K', (TOKEN_KING[0].X-.5)*CELL_SIZE, (TOKEN_KING[0].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.fillText('Q', (TOKEN_QUEEN[0].X-.5)*CELL_SIZE, (TOKEN_QUEEN[0].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('Q', (TOKEN_QUEEN[0].X-.5)*CELL_SIZE, (TOKEN_QUEEN[0].Y-.5)*CELL_SIZE + baselineOffset);

	canvasContext.fillStyle = COLOR_PLAYER_2;
	canvasContext.fillText('K', (TOKEN_KING[1].X-.5)*CELL_SIZE, (TOKEN_KING[1].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('K', (TOKEN_KING[1].X-.5)*CELL_SIZE, (TOKEN_KING[1].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.fillText('Q', (TOKEN_QUEEN[1].X-.5)*CELL_SIZE, (TOKEN_QUEEN[1].Y-.5)*CELL_SIZE + baselineOffset);
	canvasContext.strokeText('Q', (TOKEN_QUEEN[1].X-.5)*CELL_SIZE, (TOKEN_QUEEN[1].Y-.5)*CELL_SIZE + baselineOffset);
}