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
