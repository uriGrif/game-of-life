const grid = document.querySelector(".grid");

const WIDTH = 80;
const HEIGHT = 80;

var aliveList = [];
var possibleNewborns = [];
var deadCells = [];

isMousePressed = false;

document.addEventListener("mousedown", () => (isMousePressed = true));
document.addEventListener("mouseup", () => (isMousePressed = false));

for (let i = 0; i < WIDTH; i++) {
	for (let j = 0; j < HEIGHT; j++) {
		const square = document.createElement("div");
		square.classList.add("cell");
		square.classList.add(`${i}-${j}`);
		square.addEventListener("mouseover", function () {
			if (isMousePressed) {
				if (square.classList.contains("alive")) {
					square.classList.remove("alive");
					aliveList.splice(aliveList.indexOf([i, j]), 1);
					// console.log(aliveList);
				} else {
					square.classList.add("alive");
					aliveList.push([i, j]);
					// console.log(aliveList);
				}
			} else {
				square.classList.add("hoverColored");
			}
		});
		square.addEventListener("mouseout", function () {
			square.classList.remove("hoverColored");
		});
		square.addEventListener("click", function () {
			if (square.classList.contains("alive")) {
				square.classList.remove("alive");
				aliveList.splice(aliveList.indexOf([i, j]), 1);
				// console.log(aliveList);
			} else {
				square.classList.add("alive");
				aliveList.push([i, j]);
				// console.log(aliveList);
			}
		});
		grid.appendChild(square);
	}
}

function countNeighbours(i, j) {
	let cont = 0;
	aliveList.forEach(cell => {
		let i_dist = Math.abs(i - cell[0]);
		let j_dist = Math.abs(j - cell[1]);
		if (
			(i_dist == 1 && j_dist == 1) ||
			(i_dist == 0 && j_dist == 1) ||
			(i_dist == 1 && j_dist == 0)
		) {
			cont++;
		}
	});
	return cont;
}

function isCellInArray(arr, cell) {
	return arr.some(item => {
		return item[0] == cell[0] && item[1] == cell[1];
	});
}

function addToPossibleNewborns(cell_i, cell_j) {
	for (let i = cell_i - 1; i < cell_i + 2; i++) {
		for (let j = cell_j - 1; j < cell_j + 2; j++) {
			if (cell_i != i || cell_j != j) {
				if (!isCellInArray(aliveList, [i, j])) {
					if (!isCellInArray(possibleNewborns, [i, j])) {
						possibleNewborns.push([i, j]);
					}
				}
			}
		}
	}
}

function render(newgen) {
	deadCells.forEach(cell => {
		// const square = document.querySelector(`.${cell[0]}-${cell[1]}`);
		const square = document.querySelector(
			`[class*="cell ${cell[0]}-${cell[1]}"]`
		);
		if (square) {
			square.classList.remove("alive");
		}
	});
	newgen.forEach(cell => {
		const square = document.querySelector(
			`[class*="cell ${cell[0]}-${cell[1]}"]`
		);
		if (square) {
			square.classList.add("alive");
		}
	});
}

var isPaused = true;
var intervalId;
var generationCount = 0;
var initialDone = false;

function pause() {
	isPaused = true;
}

function restart() {
	isPaused = true;
	initialDone = false;
	generationCount = 0;
	document.querySelector(
		"#genCounter"
	).innerHTML = `Generation: ${generationCount}`;
	clearInterval(intervalId);
	aliveList = [];
	possibleNewborns = [];
	deadCells = [];
	document.querySelectorAll(`[class*="alive"]`).forEach(square => {
		square.classList.remove("alive");
	});
}

function action() {
	if (isPaused) {
		if (!initialDone) {
			start();
		} else {
			isPaused = false;
		}
	} else {
		pause();
	}
}

function start() {
	let newGeneration;
	initialDone = true;
	isPaused = false;

	// console.log(aliveList);

	intervalId = setInterval(() => {
		if (!isPaused) {
			//copy survivors to new generation
			newGeneration = aliveList.filter(cell => {
				addToPossibleNewborns(cell[0], cell[1]);
				let neighbours = countNeighbours(cell[0], cell[1]);
				if (neighbours == 2 || neighbours == 3) {
					return true;
				}
				// console.log("muere");
				// console.log(cell);
				deadCells.push(cell);
				return false;
			});
			// console.log(newGeneration);

			//add newborns to new generation
			possibleNewborns.forEach(cell => {
				let neighbours = countNeighbours(cell[0], cell[1]);
				if (neighbours == 3) {
					newGeneration.push(cell);
				}
			});

			possibleNewborns = [];

			aliveList = newGeneration;

			// console.log(newGeneration);
			// console.log(deadCells);
			render(newGeneration);

			deadCells = [];

			generationCount++;
			document.querySelector(
				"#genCounter"
			).innerHTML = `Generation: ${generationCount}`;
		}
	}, 100);
}
