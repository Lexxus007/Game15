const maxBoardSize = 520;													//максимальний розмір дошки у px, висота або ширина
const tileMoveTime = 90;													//час на пересування плитки
const localStorageMovesRecordsKey = "game15movesRecords";					//ключ за яким зберігаються рекорди по кількості ходів
const localStorageTimeRecordsKey = "game15timeRecords";					//ключ за яким зберігаються рекорди часу
const localStoragePositionKey = "game15CurrentPosition";					//ключ за яким зберігається позиція плиток
let tileSize;															//розмір плитки у пікселях
let totalRows;
let totalColumns;
let tilesQuantity;														//загальна кількість плиток
let emptyTileindex;														//індекс порожньої клітини
let stopwatchHandler;
let stopwatchCounter;
let movesRecordsData;													//таблиця рекордів по кількості ходів
let timeRecordsData;													//таблиця рекордів по часу
let currentBoardDataKey;												//ключ розміру ігрового поля за яким зберігаються рекорди
let savedPositionData;													//дані позиції для зберігання
let gamePausedFlag = false;
let tiles;												//масив всіх плиток
let puzzleIsSolved;											//перевірка чи розв'язана головоломка
