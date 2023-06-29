let totalRowsField = document.querySelector("#totalRowsField");
let totalColumnsField = document.querySelector("#totalColumnsField");
let recordsRowTemplate = document.querySelector("#recordsRowTemplate");
let board = document.querySelector("#board");
let pausedElement = document.querySelector("#pausedElement");
let newGameBtn = document.querySelector("#newGameBtn");
let pauseBtn = document.querySelector("#pauseBtn");
let movesCountField = document.querySelector("#movesCountField");
let timeCountField = document.querySelector("#timeCountField");
let movesRecordsField = document.querySelector("#movesRecords");
let timeRecordsField = document.querySelector("#timeRecords");

function renderControlPanel() {
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
}