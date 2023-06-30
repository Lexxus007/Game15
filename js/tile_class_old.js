class Tile {
	#column;					//стовбець в якому зараз плитка
	#row;						//ряд в якому зараз плитка
	#numberOfTile;				//номер плитки
	#tileSize;					//розмір плитки у px
	#tileElement;				//елемент що відображається
	#tileMoveTime;				//час пересування плитки в мілісекундах
	#moveTileIntervalHandler;
	
	constructor(numberOfTile, column, row, tileSize, tilesQuantity, tileMoveTime){
		this.#numberOfTile = numberOfTile;
		this.#column = column;
		this.#row = row;
		this.#tileSize = tileSize;
		this.#tileMoveTime = tileMoveTime;
		
		if (numberOfTile != tilesQuantity){
			this.#tileElement = document.createElement("div");
			this.#tileElement.classList.add("tile");
			this.#tileElement.style.width = tileSize + "px";
			this.#tileElement.style.height = tileSize + "px";
			this.#tileElement.style.fontSize = tileSize / 2 + "px";
			this.#tileElement.style.lineHeight = tileSize + "px";
			this.#tileElement.style.left = (tileSize + 10) * (column - 1) + 3 + "px";
			this.#tileElement.style.top = (tileSize + 10) * (row - 1) + 3 + "px";
			this.#tileElement.innerHTML = numberOfTile;
			this.#tileElement.connectedTile = this;
		}
	}
	
	moveTile(directionX, directionY){
		this.#column = this.#column + directionX;
		this.#row = this.#row + directionY;
	
		if (this.#tileElement) {					//ігноруємо якщо такого елементу не існує, тобо це порожня клітина
			let moveDistance = 0;
			let tileMoveStep = 10 * this.#tileSize / this.#tileMoveTime;
			let startLeftPosition = parseInt(this.#tileElement.style.left);
			let startTopPosition = parseInt(this.#tileElement.style.top);
			
			this.#moveTileIntervalHandler = setInterval(() => {
				moveDistance += tileMoveStep;
				if (moveDistance < (this.#tileSize + 10)) {
					this.#tileElement.style.left = startLeftPosition + moveDistance * directionX + "px";
					this.#tileElement.style.top = startTopPosition + moveDistance * directionY + "px";
				} else {
					clearInterval(this.#moveTileIntervalHandler);
					this.#moveTileIntervalHandler = null;
					this.#tileElement.style.left = (this.#tileSize + 10) * (this.#column - 1) + 3 + "px";
					this.#tileElement.style.top = (this.#tileSize + 10) * (this.#row - 1) + 3 + "px";
				}
			}, 10);
		}
	}
	
	get column() {
		return this.#column;
	}
	
	set column(value) {
		this.#column = value;
	}
	
	get row() {
		return this.#row;
	}

	set row(value) {
		this.#row = value;
	}
	
	get numberOfTile() {
		return this.#numberOfTile;
	}
	
	get moveTileIntervalHandler() {
		return this.#moveTileIntervalHandler;
	}
	
	get tileElement() {
		return this.#tileElement;
	}
	
}