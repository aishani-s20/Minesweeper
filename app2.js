let board = [];

let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0; //goal to click all tiles except the ones containing mines
let flagEnabled = false;

let gameOver = false;

let bombSound = new Audio("bomb.wav");

function setMines(rows, columns, minesCount) {
    // minesLocation.push("2-2");

    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    const size = parseInt(document.getElementById("size").value);
    const minesCount = parseInt(document.getElementById("mines_num").value);
    const rows = size;
    const columns = size;

    const oldBoard = document.getElementById("board");
    if (oldBoard) oldBoard.remove();

    // Reset global variables
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    gameOver = false;


    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines(rows, columns, minesCount);

    const boardDiv = document.createElement("div");
    boardDiv.id = "board";
    boardDiv.style.width = (rows * 50) + "px";
    boardDiv.style.height = (rows * 50) + "px";


    //populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", () => {
                clickTile(tile, rows, columns, minesCount);
            });
            boardDiv.appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }
    document.body.appendChild(boardDiv);
    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile(tile, rows, columns, minesCount) {
    if (gameOver || tile.classList.contains("tile-clicked")) {
        return;
    }

    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        bombSound.play();
        gameOver = true;
        revealMines(rows, columns);
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c, rows, columns, minesCount);

}

function revealMines(rows, columns) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c, rows, columns, minesCount) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r - 1, c - 1, rows, columns);      //top left
    minesFound += checkTile(r - 1, c, rows, columns);        //top 
    minesFound += checkTile(r - 1, c + 1, rows, columns);      //top right

    //left and right
    minesFound += checkTile(r, c - 1, rows, columns);        //left
    minesFound += checkTile(r, c + 1, rows, columns);        //right

    //bottom 3
    minesFound += checkTile(r + 1, c - 1, rows, columns);      //bottom left
    minesFound += checkTile(r + 1, c, rows, columns);        //bottom 
    minesFound += checkTile(r + 1, c + 1, rows, columns);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";

        //top 3
        checkMine(r - 1, c - 1, rows, columns, minesCount);    //top left
        checkMine(r - 1, c, rows, columns, minesCount);      //top
        checkMine(r - 1, c + 1, rows, columns, minesCount);    //top right

        //left and right
        checkMine(r, c - 1, rows, columns, minesCount);      //left
        checkMine(r, c + 1, rows, columns, minesCount);      //right

        //bottom 3
        checkMine(r + 1, c - 1, rows, columns, minesCount);    //bottom left
        checkMine(r + 1, c, rows, columns, minesCount);      //bottom
        checkMine(r + 1, c + 1, rows, columns, minesCount);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c, rows, columns) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}