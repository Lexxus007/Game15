let maxBoardSize = 520;													//максимальний розмір дошки у px, висота або ширина
let tileSize;															//розмір плитки у пікселях
let tileMoveTime = 90;													//час на пересування плитки
let totalRowsField = document.querySelector("#totalRowsField");
let totalColumnsField = document.querySelector("#totalColumnsField");
let totalRows;
let totalColumns;
let tilesQuantity;														//загальна кількість плиток
let emptyTileindex;														//індекс порожньої клітини
let stopwatchHandler;
let stopwatchCounter;
let movesRecordsData;													//таблиця рекордів по кількості ходів
let timeRecordsData;													//таблиця рекордів по часу
let currentBoardDataKey;												//ключ розміру ігрового поля за яким зберігаються рекорди
let localStorageMovesRecordsKey = "game15movesRecords";					//ключ за яким зберігаються рекорди по кількості ходів
let localStorageTimeRecordsKey = "game15timeRecords";					//ключ за яким зберігаються рекорди часу
let savedPositionData;													//дані позиції для зберігання
let localStoragePositionKey = "game15CurrentPosition";					//ключ за яким зберігається позиція плиток
let recordsRowTemplate = document.querySelector("#recordsRowTemplate");
let gamePausedFlag = false;

let board = document.querySelector("#board");
let pausedElement = document.querySelector("#pausedElement");
let newGameBtn = document.querySelector("#newGameBtn");
let pauseBtn = document.querySelector("#pauseBtn");
let movesCountField = document.querySelector("#movesCountField");
let timeCountField = document.querySelector("#timeCountField");
let movesRecordsField = document.querySelector("#movesRecords");
let timeRecordsField = document.querySelector("#timeRecords");

let tiles;												//масив всіх плиток
let puzzleIsSolved;											//перевірка чи розв'язана головоломка

addMoveTilesEvents();
restoreCurrentTilesPosition();
makeStartBoardAndOptions(savedPositionData);
updateRecordsDataFromStorage();
updateRecordsFields();

totalRowsField.addEventListener("change", function(){
	makeStartBoardAndOptions();
	updateRecordsFields();
}, false);

totalColumnsField.addEventListener("change", function(){
	makeStartBoardAndOptions();
	updateRecordsFields();
}, false);

newGameBtn.addEventListener("click", function(){
	resetStopwatch();
	movesCountField.innerHTML = 0;
	shuffle();
}, false);

pauseBtn.addEventListener("click", pauseResumeGame, false);

function makeStartBoardAndOptions(savedPosition) {
	board.innerHTML = "";
	tiles = [];
	movesCountField.innerHTML = 0;
	totalRows = parseInt(totalRowsField.value);
	totalColumns = parseInt(totalColumnsField.value);
	tileSize = maxBoardSize / Math.max(totalRows, totalColumns) - 10;		
	board.style.width = (tileSize + 10) * totalColumns + "px";	//задаємо ширину поля з урахуванням відстані між плитками
	board.style.height = (tileSize + 10) * totalRows + "px";	//задаємо висоту поля з урахуванням відстані між плитками
	tilesQuantity = totalRows * totalColumns;
	
	if (savedPosition){
		savedPosition.tilesPos.forEach(tile => {
			tiles.push(new Tile(tile.numberOfTile, tile.column, tile.row, tileSize, tilesQuantity, tileMoveTime));
		});
		stopwatchCounter = savedPosition.stopwatchCounter;
		movesCountField.innerHTML = savedPosition.moovesCount;
		emptyTileindex = tiles.findIndex(tile => tile.numberOfTile === tilesQuantity);
		puzzleIsSolved = false;
		addPointerCursor();
		pauseResumeGame();
	} else {
		puzzleIsSolved = true;
		resetStopwatch();

		for (let row = 1; row <= totalRows; row++){
			for (let column = 1; column <= totalColumns; column++){
				let numberOfTile = (row - 1) * totalColumns + column;
				tiles.push(new Tile(numberOfTile, column, row, tileSize, tilesQuantity, tileMoveTime));
			}
		}
	}
	
	tiles.forEach(tile => {
		if (tile.tileElement) {		
			board.append(tile.tileElement);
		}
	});	
}

function addMoveTilesEvents(){
	board.addEventListener("click", function(e){
		if (!puzzleIsSolved && e.target.connectedTile){
			makeMoveMouse(e.target.connectedTile);
		}
		
		checkSolution();
		addPointerCursor();
	}, false);
	window.addEventListener("keydown", function(e){
		if (!puzzleIsSolved){
			makeMoveKeyboard(e.key);
		}
		
		checkSolution();
		addPointerCursor();
	}, false);
}

function shuffle(){
		totalRowsField.setAttribute("disabled", "disabled");
		totalColumnsField.setAttribute("disabled", "disabled");
		newGameBtn.setAttribute("disabled", "disabled");
		pauseBtn.setAttribute("disabled", "disabled");
		
		let shuffleTime = 2000;
		let randomNumbers;

		do {
			randomNumbers = makeRandomNumbersList();
		}
		while (!checkListToHaveSolution(randomNumbers));
		
		tiles = [];
		
		for (let row = 1; row <= totalRows; row++){
			for (let column = 1; column <= totalColumns; column++){
				let numberOfTile = randomNumbers[(row - 1) * totalColumns + column - 1];
				tiles.push(new Tile(numberOfTile, column, row, tileSize, tilesQuantity, tileMoveTime));
			}
		}
		
		let boardDivs = board.querySelectorAll("div");
		
		for (let i = 0; i < boardDivs.length; i++){
			
			setTimeout(() => {
				boardDivs[i].remove();
			}, i * shuffleTime / tilesQuantity);
		}
		
		for (let i = 0; i < tilesQuantity; i++){
			
			setTimeout(() => {
				if (tiles[i].tileElement) {
					board.append(tiles[i].tileElement);
				}
			}, shuffleTime + i * shuffleTime / tilesQuantity);
		}
		
		emptyTileindex = tiles.findIndex(tile => tile.numberOfTile === tilesQuantity);
		puzzleIsSolved = false;

		setTimeout(() => {
			totalRowsField.removeAttribute("disabled");
			totalColumnsField.removeAttribute("disabled");
			newGameBtn.removeAttribute("disabled");
			pauseBtn.removeAttribute("disabled");
			startStopwatch();
			addPointerCursor();
		}, shuffleTime * 2);
		
		playSound("sounds/makePosition.mp3", 4000);
}

function makeRandomNumbersList(){						//створюється випадковий ряд чисел
	let outputNumbers = [];
	
	for (let i = 1; i <= tilesQuantity; i++){
		outputNumbers.push(i);
	}
	
	outputNumbers.sort(() => Math.random() - 0.5);
	return outputNumbers;
}

function checkListToHaveSolution(list){					//перевірка чи має розв'язок такий список розташування плиток
	let count = 0;
	let emptyTileRow;
	
	for (let i = 0; i < list.length; i++){
		if (list[i] != tilesQuantity){
			for (let j = i + 1; j < list.length; j++){
				if ((list[j] != tilesQuantity) && (list[i] > list[j])){
					count++;
				}
			}
		} else {
			emptyTileRow = Math.floor(i / totalRows) + 1;
		}
	}
	
	count = (count + (totalRows - emptyTileRow) * (totalColumns % 2 + 1) + 1) % 2;			//якщо на виході 1 то розв'язок існує
	return count;
}

function makeMoveMouse(connectedTile) {
	let connectedTilePositionX = tiles[emptyTileindex].column - connectedTile.column;	//позиція плитки відносно порожнюої клітини по осі X
	let connectedTilePositionY = tiles[emptyTileindex].row - connectedTile.row;			//позиція плитки відносно порожнюої клітини по осі Y
	let checkPosition = Math.abs(connectedTilePositionX) + Math.abs(connectedTilePositionY);			//перевіряємо чи знаходиться обрана плитка поряд із порожньою
	if (checkPosition === 1 && !connectedTile.moveTileIntervalHandler){		//перевіряємо чи вже не запущено інтервал руху плитки
		connectedTile.moveTile(connectedTilePositionX, connectedTilePositionY);
		tiles[emptyTileindex].moveTile(-1 * connectedTilePositionX, -1 * connectedTilePositionY);
		playSound("sounds/moveSound.mp3", 1000);
		saveCurrentTilesPosition();
		movesCountField.innerHTML++;
	}
}

function makeMoveKeyboard(key){
	let directionX = 0;
	let directionY = 0;
	
	if (key === "ArrowUp" && tiles[emptyTileindex].row < totalRows){
		directionY = -1;
	} else if (key === "ArrowDown" && tiles[emptyTileindex].row > 1){
		directionY = 1;
	} else if (key === "ArrowLeft" && tiles[emptyTileindex].column < totalColumns){
		directionX = -1;
	} else if (key === "ArrowRight" && tiles[emptyTileindex].column > 1){
		directionX = 1;
	} else {
		return;
	}

	if (directionX != 0 || directionY != 0){
		let tileToMoveRow = tiles[emptyTileindex].row - directionY;
		let tileToMoveColumn = tiles[emptyTileindex].column - directionX;
		let tileToMoveIndex = tiles.findIndex(tile => tile.row === tileToMoveRow && tile.column === tileToMoveColumn);
		
		if (!tiles[tileToMoveIndex].moveTileIntervalHandler){				//поки плитка рухається вона буде ігнорувати команди
			tiles[tileToMoveIndex].moveTile(directionX, directionY);
			tiles[emptyTileindex].moveTile(-1 * directionX, -1 * directionY);
			playSound("sounds/moveSound.mp3", 1000);
			saveCurrentTilesPosition();
			movesCountField.innerHTML++;
		}
	}
}

function checkSolution() {
	let correctSolution = true;
	let checkingTile = 0;
	while ((checkingTile < tilesQuantity) && (correctSolution === true)) {
		if (tiles[checkingTile].numberOfTile != (tiles[checkingTile].row - 1) * totalColumns + tiles[checkingTile].column){
			correctSolution = false;
		}
		
		checkingTile++;
	}
	
	if (!puzzleIsSolved && correctSolution){
		puzzleIsSolved = true;
		stopStopwatch();
		addNewRecord();
		saveRecordsDataToStorage();
		updateRecordsFields();
		deleteCurrentTilesPosition();
	}
	
	return correctSolution;
}

function addPointerCursor() {
	tiles.forEach(tile => {
		if(tile.tileElement) {
			tile.tileElement.classList.remove("nearTile");
			
			if(!puzzleIsSolved){
				let tilePositionX = tiles[emptyTileindex].column - tile.column;			//позиція плитки відносно порожнюої клітини по осі X
				let tilePositionY = tiles[emptyTileindex].row - tile.row;				//позиція плитки відносно порожнюої клітини по осі Y
				let checkPosition = Math.abs(tilePositionX) + Math.abs(tilePositionY);	//перевіряємо чи знаходиться обрана плитка поряд із порожньою
				
				if (checkPosition === 1){
					tile.tileElement.classList.add("nearTile");
				}
			}
		}
	});
}

function playSound(linkSoundFile, timeToDelete){
	let sound = document.createElement("audio");
	sound.setAttribute("src", linkSoundFile);
	document.querySelector("body").append(sound);
	sound.play();
	
	setTimeout(() => sound.remove(), timeToDelete);
}

function startStopwatch(){
	if (!stopwatchHandler){
		stopwatchHandler = setInterval(() => {
			stopwatchCounter++;
			timeCountField.innerHTML = makeMinutesSecondsTimeFormat(stopwatchCounter);
		}, 1000);
	}
}

function stopStopwatch(){
	clearInterval(stopwatchHandler);
	stopwatchHandler = null;
}

function resetStopwatch(){
	clearInterval(stopwatchHandler);
	stopwatchHandler = null;
	timeCountField.innerHTML = "00:00";
	stopwatchCounter = 0;
}

function makeMinutesSecondsTimeFormat(nemberOfSeconds){
	let seconds = nemberOfSeconds % 10;
	let dozensSeconds = (nemberOfSeconds % 60 - seconds) / 10;
	let minutes = (nemberOfSeconds % 600 - dozensSeconds * 10 - seconds) / 60;
	let dozensMinutes = (nemberOfSeconds - minutes * 60 - dozensSeconds * 10 - seconds) / 600;
	return `${dozensMinutes}${minutes}:${dozensSeconds}${seconds}`;
}

function updateRecordsDataFromStorage(){
	movesRecordsData = JSON.parse(localStorage.getItem(localStorageMovesRecordsKey));
	timeRecordsData = JSON.parse(localStorage.getItem(localStorageTimeRecordsKey));
}

function saveRecordsDataToStorage(){
	localStorage.setItem(localStorageMovesRecordsKey, JSON.stringify(movesRecordsData));
	localStorage.setItem(localStorageTimeRecordsKey, JSON.stringify(timeRecordsData));
}
	
function updateRecordsFields(){
	currentBoardDataKey = `${totalRows}${totalColumns}`;
	
	movesRecordsField.innerHTML = "";
	let templateClone = recordsRowTemplate.content.cloneNode(true);
	templateClone.querySelector("#recordsTemplatePlace").textContent = "#";
	templateClone.querySelector("#recordsTemplateCol1").textContent = "Moves";
	templateClone.querySelector("#recordsTemplateCol2").textContent = "Time";
	movesRecordsField.append(templateClone);

	for (let i = 0; i < 5; i++){
		templateClone = recordsRowTemplate.content.cloneNode(true);
		templateClone.querySelector("#recordsTemplatePlace").textContent = i + 1;
		
		if (movesRecordsData && movesRecordsData[currentBoardDataKey] && movesRecordsData[currentBoardDataKey][i]){
			templateClone.querySelector("#recordsTemplateCol1").textContent = movesRecordsData[currentBoardDataKey][i].moves;
			templateClone.querySelector("#recordsTemplateCol2").textContent = makeMinutesSecondsTimeFormat(movesRecordsData[currentBoardDataKey][i].time);
		} else {
			templateClone.querySelector("#recordsTemplateCol1").textContent = "-";
			templateClone.querySelector("#recordsTemplateCol2").textContent = "-";
		}
		
		movesRecordsField.append(templateClone);
	}
	
	timeRecordsField.innerHTML = "";
	templateClone = recordsRowTemplate.content.cloneNode(true);
	templateClone.querySelector("#recordsTemplatePlace").textContent = "#";
	templateClone.querySelector("#recordsTemplateCol1").textContent = "Time";
	templateClone.querySelector("#recordsTemplateCol2").textContent = "Moves";
	timeRecordsField.append(templateClone);
	
	for (let i = 0; i < 5; i++){
		templateClone = recordsRowTemplate.content.cloneNode(true);
		templateClone.querySelector("#recordsTemplatePlace").textContent = i + 1;
		
		if (timeRecordsData && timeRecordsData[currentBoardDataKey] && timeRecordsData[currentBoardDataKey][i]){
			templateClone.querySelector("#recordsTemplateCol1").textContent = makeMinutesSecondsTimeFormat(timeRecordsData[currentBoardDataKey][i].time);
			templateClone.querySelector("#recordsTemplateCol2").textContent = timeRecordsData[currentBoardDataKey][i].moves;
		} else {
			templateClone.querySelector("#recordsTemplateCol1").textContent = "-";
			templateClone.querySelector("#recordsTemplateCol2").textContent = "-";
		}
		
		timeRecordsField.append(templateClone);
	}
}

function addNewRecord(){
	let currentRecord = {};
	currentRecord.time = stopwatchCounter;
	currentRecord.moves = +movesCountField.innerHTML;
	
	currentBoardDataKey = `${totalRows}${totalColumns}`;
	
//додаємо рекорд по кількості ходів
	if (!movesRecordsData){
		movesRecordsData = {};
	}
	
	if (!movesRecordsData[currentBoardDataKey]){
		movesRecordsData[currentBoardDataKey] = [];
	}
	
	let movesRecordAddedFlag = false;

	for (i = 0; i < movesRecordsData[currentBoardDataKey].length; i++){
		if (currentRecord.moves < movesRecordsData[currentBoardDataKey][i].moves || currentRecord.moves === movesRecordsData[currentBoardDataKey][i].moves & currentRecord.time < movesRecordsData[currentBoardDataKey][i].time){
			movesRecordsData[currentBoardDataKey].splice(i, 0, currentRecord);
			movesRecordAddedFlag = true;
			break;
		}
	}
	
	if (!movesRecordAddedFlag){
		movesRecordsData[currentBoardDataKey].push(currentRecord);
	}
	
	if (movesRecordsData[currentBoardDataKey].length > 5){
		movesRecordsData[currentBoardDataKey].length = 5;
	}

//додаємо рекорд по часу
	if (!timeRecordsData){
		timeRecordsData = {};
	}
	
	if (!timeRecordsData[currentBoardDataKey]){
		timeRecordsData[currentBoardDataKey] = [];
	}
	
	let timeRecordAddedFlag = false;

	for (i = 0; i < timeRecordsData[currentBoardDataKey].length; i++){
		if (currentRecord.time < timeRecordsData[currentBoardDataKey][i].time || currentRecord.time === timeRecordsData[currentBoardDataKey][i].time & currentRecord.moves < timeRecordsData[currentBoardDataKey][i].moves){
			timeRecordsData[currentBoardDataKey].splice(i, 0, currentRecord);
			timeRecordAddedFlag = true;
			break;
		}
	}

	if (!timeRecordAddedFlag){
		timeRecordsData[currentBoardDataKey].push(currentRecord);
	}

	if (timeRecordsData[currentBoardDataKey].length > 5){
		timeRecordsData[currentBoardDataKey].length = 5;
	}
}

function saveCurrentTilesPosition(){
	savedPositionData = {};
	savedPositionData.moovesCount = movesCountField.innerHTML;
	savedPositionData.stopwatchCounter = stopwatchCounter;
	savedPositionData.totalRows = totalRows;
	savedPositionData.totalColumns = totalColumns;
	savedPositionData.tilesPos = [];
	tiles.forEach(tile => {
		let tileData = {};
		tileData.row = tile.row;
		tileData.column = tile.column;
		tileData.numberOfTile = tile.numberOfTile;
		savedPositionData.tilesPos.push(tileData);
	});
	localStorage.setItem(localStoragePositionKey, JSON.stringify(savedPositionData));
}

function restoreCurrentTilesPosition(){
	savedPositionData = JSON.parse(localStorage.getItem(localStoragePositionKey));
	if (savedPositionData){
		totalRowsField.value = savedPositionData.totalRows;
		totalColumnsField.value = savedPositionData.totalColumns;
		
	}
}

function deleteCurrentTilesPosition(){
	localStorage.removeItem(localStoragePositionKey);
}

function pauseResumeGame(){
	if (!gamePausedFlag){
		gamePausedFlag = true;
		totalRowsField.setAttribute("disabled", "disabled");
		totalColumnsField.setAttribute("disabled", "disabled");
		newGameBtn.setAttribute("disabled", "disabled");
		board.classList.add("hideElement");
		pausedElement.classList.remove("hideElement");
		pausedElement.style.width = board.style.width;
		pausedElement.style.height = board.style.height;
		pausedElement.style.lineHeight = parseInt(board.style.height) + "px";
		pausedElement.style.fontSize = parseInt(board.style.width) / 7 + "px";
		stopStopwatch();
		pauseBtn.innerHTML = "Resume";
	} else {
		gamePausedFlag = false;
		totalRowsField.removeAttribute("disabled");
		totalColumnsField.removeAttribute("disabled");
		newGameBtn.removeAttribute("disabled");
		pausedElement.classList.add("hideElement");
		board.classList.remove("hideElement");
		pauseBtn.innerHTML = "Pause";
		
		if (!puzzleIsSolved){
			startStopwatch();
		}
	}
}