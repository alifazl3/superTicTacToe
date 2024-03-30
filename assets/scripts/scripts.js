let currentPlayer = "X";
let lastPlayedCell = null;

let boardState = {
  smallGames: Array(9).fill(null).map(() => Array(9).fill("")),
  largeGame: Array(9).fill("")
};

for (let i = 1; i <= 9; i++) {
  document.getElementById("mainTttCell" + i).appendChild(TicTacToe(i));
}

function TicTacToe(smallGameIndex) {
  let ticTacToeWrapper = document.createElement("div");
  ticTacToeWrapper.className = "ticTacToe-wrapper";
  for (let i = 1; i <= 9; i++) {
    let cell = document.createElement("div");
    cell.className = "ticTacToe ticTacToe-" + i;
    cell.setAttribute("data-small-game-index", smallGameIndex - 1);
    cell.setAttribute("data-cell-index", i - 1);
    cell.addEventListener("click", function() { handleClick(cell, smallGameIndex - 1, i - 1); });
    ticTacToeWrapper.appendChild(cell);
  }
  return ticTacToeWrapper;
}

function handleClick(cell, smallGameIndex, cellIndex) {
  if (cell.textContent === "" &&
    (lastPlayedCell === null || smallGameIndex === lastPlayedCell ||
      isBoardFull(lastPlayedCell) || isBoardWon(lastPlayedCell))) {

    if (!isBoardWon(smallGameIndex)) {
      let span = document.createElement("span");
      span.textContent = currentPlayer;
      span.className = currentPlayer;
      cell.appendChild(span);

      updateGameState(smallGameIndex, cellIndex, currentPlayer);

      if (isBoardWon(smallGameIndex) || isBoardFull(smallGameIndex)) {
        lastPlayedCell = null;
      } else {
        lastPlayedCell = cellIndex;
      }

      currentPlayer = (currentPlayer === "X") ? "O" : "X";
    } else {
      console.log("This game has already  won. Choose another.");
    }
  } else {
    console.log("Invalid move or cell is already filled.");
  }
}

function isBoardFull(boardIndex) {
  return boardState.smallGames[boardIndex].every(cell => cell !== "");
}

function isBoardWon(boardIndex) {
  return checkWin(boardState.smallGames[boardIndex], "X") || checkWin(boardState.smallGames[boardIndex], "O");
}



function checkWin(gameBoard, player) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return lines.some(line => {
    return line.every(index => {
      return gameBoard[index] === player;
    });
  });
}

function updateGameState(smallGameIndex, cellIndex, player) {
  boardState.smallGames[smallGameIndex][cellIndex] = player;

  if (checkWin(boardState.smallGames[smallGameIndex], player)) {
    boardState.largeGame[smallGameIndex] = player;

    if (checkWin(boardState.largeGame, player)) {
      console.log(player + " wins the whole game!");
    }
  }
}

