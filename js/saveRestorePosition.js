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
