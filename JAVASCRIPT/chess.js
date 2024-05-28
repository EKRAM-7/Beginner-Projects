const chessboard = document.querySelector('.chessboard');
const boardStructure = [];
const boxNumber = {}
const file_reference = {
	0: 'a',
	1: 'b',
	2: 'c',
	3: 'd',
	4: 'e',
	5: 'f',
	6: 'g',
	7: 'h'
}
const imageReference = {
	0: ['DarkRook.png',
		'LightRook.png'],
	1: ['DarkKnight.png',
		'LightKnight.png'],
	2: ['DarkBishop.png',
		'LightBishop.png'],
	3: ['DarkQueen.png',
		'LightQueen.png'],
	4: ['DarkKing.png',
		'LightKing.png'],
	5: ['DarkBishop.png',
		'LightBishop.png'],
	6: ['DarkKnight.png',
		'LightKnight.png'],
	7: ['DarkRook.png',
		'LightRook.png']
}
const pieceName = {
	0: 'rook',
	1: 'knight',
	2: 'bishop',
	3: 'queen',
	4: 'king',
	5: 'bishop',
	6: 'knight',
	7: 'rook'
}
const leftEdge = ['a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
const rightEdge = ['h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
const bottomEdge = ['b1', 'c1', 'd1', 'e1', 'f1', 'g1'];
const topEdge = ['b8', 'c8', 'd8', 'e8', 'f8', 'g8'];
const corners = ['a8', 'a1', 'h8', 'h1'];
let turn = 'white';
// Loop to create 64 squares
for (let i = 0; i < 64; i++) {
	const square = document.createElement('div');
	square.classList.add('square');
	// Logic for Alternating colors
	if ((i + Math.floor(i / 8)) % 2 === 0) {
		square.classList.add('light');
	} else {
		square.classList.add('dark');
	}

	// The logic for assigning a unique coordinate to all the 64 squares in the chessboard.
	let rank;
	if (i >= 0 && i < 8) rank = '8';
	else if (i >= 8 && i < 16) rank = '7';
	else if (i >= 16 && i < 24) rank = '6';
	else if (i >= 24 && i < 32) rank = '5';
	else if (i >= 32 && i < 40) rank = '4';
	else if (i >= 40 && i < 48) rank = '3';
	else if (i >= 48 && i < 56) rank = '2';
	else if (i >= 56 && i < 64) rank = '1';
	let boxCoordinates = `${file_reference[i % 8]}${rank}`;

	boardStructure.push(boxCoordinates);
	boxNumber[boxCoordinates] = i;
	chessboard.appendChild(square); // this will assign all the squares a common class.

	square.setAttribute('id', boxCoordinates); //this will assign a unique id to all the boxes

}


/***=================XXX================***\


/*** INITIAL PLACEMENT OF THE PIECES ***/

function initialPositions() {
	for (let i = 0; i < 8; i++) {
		let rank8 = document.getElementById(boardStructure[i])
		let rank7 = document.getElementById(boardStructure[i + 8])
		let rank2 = document.getElementById(boardStructure[i + 48])
		let rank1 = document.getElementById(boardStructure[i + 56])

		rank7.innerHTML = "<img src='../Images/DarkPawn.png' class='piece black pawn'>";
		rank2.innerHTML = "<img src='../Images/LightPawn.png' class='piece white pawn'>";
		rank1.innerHTML = `<img src='../Images/${imageReference[i][1]}' class='piece white ${pieceName[i]}'>`;
		rank8.innerHTML = `<img src='../Images/${imageReference[i][0]}' class='piece black ${pieceName[i]}'>`;
	}
}
initialPositions();


// the object below is storing the functions that determines the movement of each piece

const pieceMovement = {
	'pawn': pawnMovement,
	'bishop': bishopMovement,
	'rook': rookMovement,
	'queen': queenMovement,
	'knight': knightMovement,
	'king': kingMovement
}
// ================XXX==================\\
/* The block of code below is responsible for every action upon CLICKS */
let boxes = document.querySelectorAll(".square");
let legalMoves;
let checkList = []; // This array will store the legal moves of the piece that has just been moved. The idea is to check those moves and see if the coordinate of the square where the opposite color king is situated is present in this array. If it does, the it's a CHECK 
let isUnderCheck = false;
let checkGiver;
let currDivId;

boxes.forEach(function (div) {
	div.addEventListener("click", function () {
		let divId = div.id; // ID of the clicked sqaure
		if (!isBoxEmpty(divId)) {
			let pieceInfo = getPieceInfo(divId);
			let piece = pieceInfo[1];
			let color = pieceInfo[0];
			if (legalMoves !== undefined && currDivId !== undefined) {
				if (legalMoves.includes(divId)) {
					movePiece(divId, currDivId);
				} else if (color === turn) { // This condition is responsible for the mechanism when the player switches their piece that they want to move during their turn.
					for (i of legalMoves) {
						document.getElementById(i).style.border = "";
					}
					legalMoves = pieceMovement[piece](divId, color);
					currDivId = divId;
					highlightLegalMoves(legalMoves);
				}
			} else { 
				if (color === turn) {
					legalMoves = pieceMovement[piece](divId, color);
					currDivId = divId;
					highlightLegalMoves(legalMoves);
				}
			}

		} else if (isBoxEmpty(divId)) {
			if (legalMoves.includes(divId)) {
				movePiece(divId, currDivId);
			}
		}

	})
}) 

// DUPLICATE CLICK RESPONDER FOR TESTING PURPOSES AND READABLE CODE
/*
boxes.forEach(function (div) {
	div.addEventListener("click", function () {
		let divId = div.id; // ID of the clicked sqaure
		
		if (!isBoxEmpty(divId)) { // If the clicked square is not empty 
			// Get the details about the piece that is on of the clicked square.
			let pieceInfo = getPieceInfo(divId);
			let piece = pieceInfo[1];// what piece 
			let color = pieceInfo[0]; // what color 
			if (legalMoves && currDivId) { // If legalMoves array and currDiv is not empty it clearly means that the square is clicked by the player either to switch the piece they want to move or to take an opponent piece out.
				
				if (legalMoves.includes(divId)) { // As long as the legalMoves array contains the id of the clicked square, it means that the piece can be moved to that sqaure.
					movePiece(divId, currDivId);
				} else if (color === turn) { // This condition is responsible for the mechanism when the player switches their piece that they want to move during their turn.
					for (i of legalMoves) {
						document.getElementById(i).style.border = "";
					}
					legalMoves = pieceMovement[piece](divId, color);
					currDivId = divId;
					highlightLegalMoves(legalMoves);
				}
			} else { // This is the condition where the legalMoves array and currDivId can be undefined, which means that this square was clicked just after a player moved a piece during their turn.
				if (color === turn) {
					if (!isUnderCheck) { // This if statement checks for the condition when the player whose turn it is, was not given any check by the opponent.
						legalMoves = pieceMovement[piece](divId, color);
						currDivId = divId;
						highlightLegalMoves(legalMoves);
					} else { // The condition when the player is under check
						// Get the legal moves of the piece that has been clicked under checked
						let pieceMoves = pieceMovement[piece](divId, color);
						legalMoves = [];
						
						// Iterate through all the ids stored in the array named pieceMoves
						for (let id of pieceMoves) {
							// now check if the id is present in the checkList array.
							if (checkList.includes(id)) { // if it is present then push it into legalMoves
								legalMoves.push(id); // The mechanism is to block the check attack given by the opponent.
							}
						}
						highlightLegalMoves(legalMoves);
					}
				}
			}
		} else if (isBoxEmpty(divId)) {
			if (legalMoves.includes(divId)) {
				movePiece(divId, currDivId);	
			}
		}

	})
}) */
// ___________________DUPLICATE CLICK RESPONDER_______ END___________


/*** ________________________ ***/

function isBoxEmpty(divId) {
	return !document.getElementById(divId).innerHTML.includes("<img");
}

function getPieceInfo(divId) {
	let box = document.getElementById(divId);
	let img = box.querySelector('img');
	return [img.classList[1], img.classList[2]];
}


// the only thing this function does is highlighting the legal moves.
function highlightLegalMoves(arr) {
	for (let i of arr) {
		let box = document.getElementById(i);
		box.style.border = '2px solid red';
	}
}

function movePiece(divId, currDivId) {
	let currBox = document.getElementById(currDivId);
	let moveToBox = document.getElementById(divId);

	moveToBox.innerHTML = currBox.innerHTML;
	currBox.innerHTML = "";

	let piece = getPieceInfo(divId)[1];
	let color = getPieceInfo(divId)[0];

	for (i of legalMoves) {
		document.getElementById(i).style.border = '';
	}
	legalMoves = undefined;
	currDivId = undefined;
	if (turn === 'white') turn = "black";
	else turn = 'white';
	/* let checkerInfo = isChecked(moveToBox.id, piece, color);
	isUnderCheck = checkerInfo[0];

	if (isUnderCheck) {
		checkGiver = checkerInfo[2];
		document.getElementById(checkerInfo[1]).style.backgroundColor = 'red';
	} */
}

/*** THE FUNCTIONS BELOW THIS POINT ARE THE FUNCTIONS THAT CALCULATES THE LEGAL MOVES THAT A PIECE CAN MAKE ***/
function pawnMovement(position, color) {
	let legalMoves = [];
	// For white pawn
	if (color === 'white') {
		// when the pawn is in 2nd rank we can move the pawn 2 squares up so for that the mechanism lies below
		// first we check if the pawn is in the 2nd rank or not
		if (boxNumber[position] >= 48 && boxNumber[position] <= 55) {
			// the variables below looks scary but it only stores the coordinates of the front 2 squares.
			let front1 = boardStructure[boxNumber[position] - 8]
			let front2 = boardStructure[boxNumber[position] - 16]
			if (isBoxEmpty(front1) && isBoxEmpty(front2)) {
				legalMoves.push(front1, front2);
			}
			if (isBoxEmpty(front1)) legalMoves.push(front1);
		} else {
			let front1 = boardStructure[boxNumber[position] - 8]
			if (isBoxEmpty(front1)) legalMoves.push(front1);
		}
		// since pawns can move diagonals by one square up so we also have to note those coordinates and then later check if their is an opposite color piece available or not in those squares.

		//checking if the diagonals have any opposite color piece or not. If it does than simply push the coordinate into legalMoves array.

		if (leftEdge.includes(position)) {
			let frontRight = boardStructure[boxNumber[position] - 7];
			if (!isBoxEmpty(frontRight) && getPieceInfo(frontRight)[0] === 'black') legalMoves.push(frontRight);

		} else if (rightEdge.includes(position)) {
			let frontLeft = boardStructure[boxNumber[position] - 9];
			if (!isBoxEmpty(frontLeft) && getPieceInfo(frontLeft)[0] === 'black') legalMoves.push(frontLeft);

		} else {
			let frontLeft = boardStructure[boxNumber[position] - 9];
			let frontRight = boardStructure[boxNumber[position] - 7];
			if (!isBoxEmpty(frontLeft) && getPieceInfo(frontLeft)[0] === 'black') legalMoves.push(frontLeft);
			if (!isBoxEmpty(frontRight) && getPieceInfo(frontRight)[0] === 'black') legalMoves.push(frontRight);
		}
	}
	// for black pawn
	else {
		if (boxNumber[position] >= 8 && boxNumber[position] <= 15) {
			// the variables below looks scary but it only stores the coordinates of the front 2 squares.
			let front1 = boardStructure[boxNumber[position] + 8]
			let front2 = boardStructure[boxNumber[position] + 16]
			if (isBoxEmpty(front1) && isBoxEmpty(front2)) {
				legalMoves.push(front1, front2);
			}
			if (isBoxEmpty(front1)) legalMoves.push(front1)
		} else {
			let front1 = boardStructure[boxNumber[position] + 8]
			if (isBoxEmpty(front1)) legalMoves.push(front1);
		}

		if (leftEdge.includes(position)) {
			let frontRight = boardStructure[boxNumber[position] + 9];
			if (!isBoxEmpty(frontRight) && getPieceInfo(frontRight)[0] === 'white') legalMoves.push(frontRight);

		} else if (rightEdge.includes(position)) {
			let frontLeft = boardStructure[boxNumber[position] + 7];
			if (!isBoxEmpty(frontLeft) && getPieceInfo(frontLeft)[0] === 'white') legalMoves.push(frontLeft);

		} else {
			let frontLeft = boardStructure[boxNumber[position] + 7];
			let frontRight = boardStructure[boxNumber[position] + 9];
			if (!isBoxEmpty(frontLeft) && getPieceInfo(frontLeft)[0] === 'white') legalMoves.push(frontLeft);
			if (!isBoxEmpty(frontRight) && getPieceInfo(frontRight)[0] === 'white') legalMoves.push(frontRight);

		}
	}
	return legalMoves;
}

function bishopMovement(position, color) {
	let legalMoves = [];
	let upRight = 0;
	let upLeft = 0;
	let downRight = 0;
	let downLeft = 0;
	if (topEdge.includes(position)) {
		downLeft = 7;
		downRight = 9;
	} else if (bottomEdge.includes(position)) {
		upRight = -7;
		upLeft = -9;
	} else if (rightEdge.includes(position)) {
		downLeft = 7;
		upLeft = -9;
	} else if (leftEdge.includes(position)) {
		downRight = 9;
		upRight = -7;
	} else if (position === 'a1') upRight = -7;
	else if (position === 'h8') downLeft = 7;
	else if (position === 'h1') upLeft = -9;
	else if (position === 'a8') downRight = 9;
	else {
		upLeft = -9;
		upRight = -7;
		downLeft = 7;
		downRight = 9;
	}

	for (let i = 1; i <= 7; i++) {
		let upRightId = boardStructure[boxNumber[position] + (upRight * i)];
		let downRightId = boardStructure[boxNumber[position] + (downRight * i)];
		let upLeftId = boardStructure[boxNumber[position] + (upLeft * i)];
		let downLeftId = boardStructure[boxNumber[position] + (downLeft * i)];


		if (!isBoxEmpty(upRightId)) {
			if (getPieceInfo(upRightId)[0] !== color) {
				legalMoves.push(upRightId);
			}
			upRight = 0;
		} else {
			if (rightEdge.includes(upRightId) || topEdge.includes(upRightId) ||
				corners.includes(upRightId)) upRight = 0;
			legalMoves.push(upRightId)
		}
		// ============================\\
		if (!isBoxEmpty(downRightId)) {
			if (getPieceInfo(downRightId)[0] !== color) {
				legalMoves.push(downRightId);
			}
			downRight = 0;
		} else {
			if (rightEdge.includes(downRightId) || bottomEdge.includes(downRightId) ||
				corners.includes(downRightId)) downRight = 0;
			legalMoves.push(downRightId)
		}
		// ============================\\

		if (!isBoxEmpty(downLeftId)) {
			if (getPieceInfo(downLeftId)[0] !== color) {
				legalMoves.push(downLeftId);
			}
			downLeft = 0;
		} else {
			if (leftEdge.includes(downLeftId) || bottomEdge.includes(downLeftId) ||
				corners.includes(downLeftId)) downLeft = 0;
			legalMoves.push(downLeftId)
		}

		if (!isBoxEmpty(upLeftId)) {
			if (getPieceInfo(upLeftId)[0] !== color) {
				legalMoves.push(upLeftId);
			}
			upLeft = 0;
		} else {
			if (leftEdge.includes(upLeftId) || topEdge.includes(upLeftId) ||
				corners.includes(upLeftId)) upLeft = 0;
			legalMoves.push(upLeftId)
		}
	}

	return legalMoves;
}

function rookMovement(position, color) {
	let legalMoves = [];
	let left = 0;
	let right = 0;
	let up = 0;
	let down = 0;

	if (rightEdge.includes(position)) {
		up = -8,
			down = 8,
			left = -1
	} else if (leftEdge.includes(position)) {
		up = -8,
			down = 8,
			right = 1;
	} else if (bottomEdge.includes(position)) {
		up = -8,
			left = -1,
			right = 1;
	} else if (topEdge.includes(position)) {
		down = 8,
			left = -1,
			right = 1
	} else if (position === 'a1') {
		up = -8,
			right = 1;
	} else if (position === 'a8') {
		down = 8,
			right = 1;
	} else if (position === 'h1') {
		up = -8,
			left = -1;
	} else if (position === 'h8') {
		down = 8,
			left = -1;
	} else {
		down = 8,
			left = -1,
			up = -8,
			right = 1;
	}

	for (let i = 1; i <= 7; i++) {
		// In each iteration the id of one box from every direction is stored.
		// so in case if any box is on the edge of the board the value of that direction is 0 so that it can't increment any further.
		let upId = boardStructure[boxNumber[position] + (i * up)]
		let downId = boardStructure[boxNumber[position] + (i * down)]
		let leftId = boardStructure[boxNumber[position] + (i * left)]
		let rightId = boardStructure[boxNumber[position] + (i * right)]

		if (!isBoxEmpty(upId)) {
			if (getPieceInfo(upId)[0] !== color) {
				legalMoves.push(upId);
			}
			up = 0;
		} else {
			if (topEdge.includes(upId) || corners.includes(upId)) {
				up = 0;
			}
			legalMoves.push(upId);
		}

		if (!isBoxEmpty(downId)) {
			if (getPieceInfo(downId)[0] !== color) {
				legalMoves.push(downId);
			}
			down = 0;
		} else {
			if (bottomEdge.includes(downId) || corners.includes(downId)) {
				down = 0;
			}
			legalMoves.push(downId);
		}

		if (!isBoxEmpty(rightId)) {
			if (getPieceInfo(rightId)[0] !== color) {
				legalMoves.push(rightId);
			}
			right = 0;
		} else {
			if (rightEdge.includes(rightId) || corners.includes(rightId)) {
				right = 0;
			}
			legalMoves.push(rightId);
		}

		if (!isBoxEmpty(leftId)) {
			if (getPieceInfo(leftId)[0] !== color) {

				legalMoves.push(leftId);
			}
			left = 0;
		} else {
			if (leftEdge.includes(leftId) || corners.includes(leftId)) {
				left = 0;
			}
			legalMoves.push(leftId);
		}
	}
	return legalMoves;
}

function queenMovement(position, color) {
	// since queens movement is the combination of rook and Bishop, we can simple calculate the rook and Bishop's moves.
	let diagonalMovement = bishopMovement(position, color);
	let straightMovement = rookMovement(position, color);
	let legalMoves = [...diagonalMovement, ...straightMovement];

	return legalMoves;

}

function knightMovement(position, color) {
	let legalMoves = [];
	//check whether the position is in the edge or corner of the board 
	let up = 0, left = 0, right = 0, down = 0;
	if (leftEdge.includes(position)) {
		up = -8, right = 1, down = 8;
	} else if (rightEdge.includes(position)) {
		up = -8, left = -1, down = 8;
	} else if (topEdge.includes(position)) {
		left = -1, right = 1, down = 8;
	} else if (bottomEdge.includes(position)) {
		left = -1, right = 1, up = -8;
	} else if (position === 'a1') {
		right = 1, up = -8;
	} else if (position === 'a8') {
		right = 1, down = 8
	} else if (position === 'h1') {
		left = -1, up = -8;
	} else if (position === 'h8') {
		left = -1, down = 8;
	} else {
		up = -8, down = 8, left = -1, right = 1;
	}

	// Check if one square from every direction is lying on any of the edges or corners of the board. If it does lies on those part then further calculation is not required.
	if (leftEdge.includes(boardStructure[boxNumber[position] + left]) || corners.includes(boardStructure[boxNumber[position] + left])) left = 0;
	if (rightEdge.includes(boardStructure[boxNumber[position] + right]) || corners.includes(boardStructure[boxNumber[position] + right])) right = 0;
	if (topEdge.includes(boardStructure[boxNumber[position] + up]) || corners.includes(boardStructure[boxNumber[position] + up])) up = 0;
	if (bottomEdge.includes(boardStructure[boxNumber[position] + down]) || corners.includes(boardStructure[boxNumber[position] + down])) down = 0;

	leftbox = boardStructure[boxNumber[position] + (2 * left)];
	rightbox = boardStructure[boxNumber[position] + (2 * right)];
	upbox = boardStructure[boxNumber[position] + (2 * up)];
	downbox = boardStructure[boxNumber[position] + (2 * down)];

	// conditions for the mechanism of when the 2 squares up box lies on the left or right edge of the box, since if that happens, the the knight can move either to the up left or up right. 
	// Same mechanism must be followed for every direction.
	// FOR UPWARDS DIRECTION
	if ((leftEdge.includes(upbox) || upbox === 'a8') && position !== upbox) {
		let upRight = boardStructure[boxNumber[upbox] + 1];
		if (isBoxEmpty(upRight)) legalMoves.push(upRight);
		else {
			if (getPieceInfo(upRight)[0] !== color) legalMoves.push(upRight);
		}
	} else if ((rightEdge.includes(upbox) || upbox === 'h8') && position !== upbox) {
		let upLeft = boardStructure[boxNumber[upbox] - 1];
		if (isBoxEmpty(upLeft)) legalMoves.push(upLeft);
		else {
			if (getPieceInfo(upLeft)[0] !== color) legalMoves.push(upLeft);
		}
	} else {
		if (position !== upbox) {
			let upRight = boardStructure[boxNumber[upbox] + 1];
			let upLeft = boardStructure[boxNumber[upbox] - 1];

			if (isBoxEmpty(upRight)) legalMoves.push(upRight);
			else if (getPieceInfo(upRight)[0] !== color) legalMoves.push(upRight);

			if (isBoxEmpty(upLeft)) legalMoves.push(upLeft);
			else if (getPieceInfo(upLeft)[0] !== color) legalMoves.push(upLeft);
		}


	}

	// FOR DOWNWARDS DIRECTION
	if ((leftEdge.includes(downbox) || downbox === 'a1') && position !== downbox) {
		let downRight = boardStructure[boxNumber[downbox] + 1];
		if (isBoxEmpty(downRight)) legalMoves.push(downRight);
		else {
			if (getPieceInfo(downRight)[0] !== color) legalMoves.push(downRight);
		}
	} else if ((rightEdge.includes(downbox) || downbox === 'h1') && position !== downbox) {
		let downLeft = boardStructure[boxNumber[downbox] - 1];
		if (isBoxEmpty(downLeft)) legalMoves.push(downLeft);
		else {
			if (getPieceInfo(downLeft)[0] !== color) legalMoves.push(downLeft);
		}
	} else {
		let downRight = boardStructure[boxNumber[downbox] + 1];
		let downLeft = boardStructure[boxNumber[downbox] - 1];
		if (position !== downbox) {
			if (isBoxEmpty(downRight)) legalMoves.push(downRight);
			else if (getPieceInfo(downRight)[0] !== color) legalMoves.push(downRight);

			if (isBoxEmpty(downLeft)) legalMoves.push(downLeft);
			else if (getPieceInfo(downLeft)[0] !== color) legalMoves.push(downLeft);
		}


	}

	// FOR LEFT DIRECTION
	if ((topEdge.includes(leftbox) || leftbox === 'a8') && position !== leftbox) {
		let leftDown = boardStructure[boxNumber[leftbox] + 8];
		if (isBoxEmpty(leftDown)) legalMoves.push(leftDown);
		else {
			if (getPieceInfo(leftDown)[0] !== color) legalMoves.push(leftDown);
		}
	} else if ((bottomEdge.includes(leftbox) || leftbox === 'a1') && position !== leftbox) {
		let leftUp = boardStructure[boxNumber[leftbox] - 8];
		if (isBoxEmpty(leftUp)) legalMoves.push(leftUp);
		else {
			if (getPieceInfo(leftUp)[0] !== color) legalMoves.push(leftUp);
		}
	} else {
		let leftDown = boardStructure[boxNumber[leftbox] + 8];
		let leftUp = boardStructure[boxNumber[leftbox] - 8];
		if (position !== leftbox) {
			if (isBoxEmpty(leftDown)) legalMoves.push(leftDown);
			else if (getPieceInfo(leftDown)[0] !== color) legalMoves.push(leftDown);

			if (isBoxEmpty(leftUp)) legalMoves.push(leftUp);
			else if (getPieceInfo(leftUp)[0] !== color) legalMoves.push(leftUp);
		}


	}
	// FOR RIGHT DIRECTION
	if ((topEdge.includes(rightbox) || rightbox === 'h8') && position !== rightbox) {
		let rightDown = boardStructure[boxNumber[rightbox] + 8];
		if (isBoxEmpty(rightDown)) legalMoves.push(rightDown);
		else {
			if (getPieceInfo(rightDown)[0] !== color) legalMoves.push(rightDown);
		}
	} else if ((bottomEdge.includes(rightbox) || rightbox === 'h1') && position !== rightbox) {
		let rightUp = boardStructure[boxNumber[rightbox] - 8];
		if (isBoxEmpty(rightUp)) legalMoves.push(rightUp);
		else {
			if (getPieceInfo(rightUp)[0] !== color) legalMoves.push(rightUp);
		}
	} else {
		let rightDown = boardStructure[boxNumber[rightbox] + 8];
		let rightUp = boardStructure[boxNumber[rightbox] - 8];
		if (position !== rightbox) {
			if (isBoxEmpty(rightDown)) legalMoves.push(rightDown);
			else if (getPieceInfo(rightDown)[0] !== color) legalMoves.push(rightDown);

			if (isBoxEmpty(rightUp)) legalMoves.push(rightUp);
			else if (getPieceInfo(rightUp)[0] !== color) legalMoves.push(rightUp);
		}


	}
	return legalMoves;
}

function kingMovement(position, color) {
	let legalMoves = [];
	let oppositeColor; // Setting a opposite color is important because the king's movement depends on the opponent pieces' line up. If any opposite color piece covering the legal move of the king then it's not a legal move anymore.
	if (color === 'white') oppositeColor = 'black';
	else oppositeColor = 'white';

	let up = 0, down = 0, left = 0, right = 0, upLeft = 0, upRight = 0, downLeft = 0, downRight = 0;

	// Mechanism to handle the case when the piece is on the edge or corners of the board.

	if (topEdge.includes(position)) {
		downLeft = 7;
		downRight = 9;
		down = 8;
		left = -1;
		right = 1;
	} else if (bottomEdge.includes(position)) {
		upRight = -7;
		upLeft = -9;
		up = -8;
		left = -1;
		right = 1;
	} else if (rightEdge.includes(position)) {
		downLeft = 7;
		upLeft = -9;
		up = -8;
		left = -1;
	} else if (leftEdge.includes(position)) {
		downRight = 9;
		upRight = -7;
		right = 1;
		up = -8;
	} else if (position === 'a1') upRight = -7, up = -8, right = 1;
	else if (position === 'h8') downLeft = 7, left = -1, down = 8;
	else if (position === 'h1') upLeft = -9, up = -8, left = -1;
	else if (position === 'a8') downRight = 9, down = 8, right = 1;
	else {
		upLeft = -9;
		upRight = -7;
		downLeft = 7;
		downRight = 9;
		up = -8;
		down = 8;
		right = 1;
		left = -1;
	}

	// Since the king can move in every direction by one sqaure.
	// The variables will store the id/coordinates of boxes in every direction by one square.
	let upId = boardStructure[boxNumber[position] + up],
		downID = boardStructure[boxNumber[position] + down],
		leftID = boardStructure[boxNumber[position] + left],
		rightID = boardStructure[boxNumber[position] + right],
		upLeftID = boardStructure[boxNumber[position] + upLeft],
		upRightID = boardStructure[boxNumber[position] + upRight],
		downLeftID = boardStructure[boxNumber[position] + downLeft],
		downRightID = boardStructure[boxNumber[position] + downRight];

	let directions = [upId, downID, leftID, rightID, upLeftID, upRightID, downLeftID, downRightID];

	for (let id of directions) {
		if (position !== id) {
			if (isBoxEmpty(id)) {
				legalMoves.push(id);
			} else if (getPieceInfo(id)[0] !== color) {
				legalMoves.push(id);
			}
		}
	}

	return legalMoves;
}


/* function isChecked(currPosition, piece, color) {
	checkList = pieceMovement[piece](currPosition, color);

	let oppositeColor = 'white';
	let kingSquare;
	if (color === 'white') oppositeColor = 'black';

	if (oppositeColor === 'black') {
		kingSquare = document.querySelectorAll('.king')[0].parentNode.id;
	} else {
		kingSquare = document.querySelectorAll('.king')[1].parentNode.id;
	}

	if (checkList.includes(kingSquare)) return [true, kingSquare, piece];
	return [false, kingSquare, piece];
} */