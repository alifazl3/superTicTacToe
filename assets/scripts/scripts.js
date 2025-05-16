<<<<<<< HEAD
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
=======
let mySymbol = null;
let isMyTurn = false;
let nextAllowedBoard = -1;
let symbolSwap = false;
const boards = Array(9).fill(null).map(() => Array(9).fill(null));
const boardWinners = Array(9).fill(null);

const roomId = new URLSearchParams(window.location.search).get("room") || "default";
const socket = new WebSocket("ws://localhost:3000/?room=" + roomId);

function buildBoard() {
  for (let i = 1; i <= 9; i++) {
    const container = document.getElementById("mainTttCell" + i);
    container.innerHTML = "<div class='winner-overlay'></div>";
    container.classList.remove("won");
    container.appendChild(TicTacToe(i));
  }
}

function restartGame() {
  symbolSwap = true;
  document.querySelector(".popup")?.remove();
  boardWinners.fill(null);
  for (let i = 0; i < 9; i++) boards[i].fill(null);
  buildBoard();
  socket.send(JSON.stringify({ type: "restart" }));
}

function showWinnerPopup(winner) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "9999";
  popup.innerHTML = `
    <div style="background: #111; padding: 40px; border-radius: 10px; color: white; font-size: 2rem; text-align: center;">
      ${winner} won the game!<br><br>
      <button onclick="restartGame()" style="padding: 10px 20px; font-size: 1rem; margin-top: 20px; cursor: pointer;">Restart</button>
    </div>
  `;
  document.body.appendChild(popup);
}

socket.onmessage = async (event) => {
  let rawData = event.data;
  if (rawData instanceof Blob) rawData = await rawData.text();
  const msg = JSON.parse(rawData);

  if (msg.type === "assign") {
    mySymbol = msg.player;
    if (symbolSwap) {
      mySymbol = mySymbol === "X" ? "O" : "X";
    }
    isMyTurn = mySymbol === "X";
    console.log("You are:", mySymbol);

  } else if (msg.type === "move") {
    placeMove(msg.board, msg.cell, msg.symbol, false);
    isMyTurn = (msg.symbol !== mySymbol);
    nextAllowedBoard = boardWinners[msg.cell] ? -1 : msg.cell;

  } else if (msg.type === "chat") {
    const chatBox = document.getElementById("chatBox");
    const p = document.createElement("div");
    p.textContent = msg.text;
    p.style.alignSelf = "flex-start";
    p.style.background = "#444";
    p.style.color = "#ddd";
    p.style.padding = "8px 12px";
    p.style.borderRadius = "12px";
    p.style.maxWidth = "70%";
    p.style.wordBreak = "break-word";
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

function sendMove(boardIndex, cellIndex) {
  socket.send(JSON.stringify({
    type: "move",
    board: boardIndex,
    cell: cellIndex,
    symbol: mySymbol
  }));
}

function sendChat() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  const chatBox = document.getElementById("chatBox");
  const p = document.createElement("div");
  p.textContent = text;
  p.style.alignSelf = "flex-end";
  p.style.background = "#4cb8ff";
  p.style.color = "#fff";
  p.style.padding = "8px 12px";
  p.style.borderRadius = "12px";
  p.style.maxWidth = "70%";
  p.style.wordBreak = "break-word";
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;

  socket.send(JSON.stringify({
    type: "chat",
    sender: mySymbol,
    text: text
  }));

  input.value = "";
}

function placeMove(boardIndex, cellIndex, symbol, isLocal) {
  if (boardWinners[boardIndex]) return;
  const cell = document.querySelector(`
    [data-small-game-index="${boardIndex}"][data-cell-index="${cellIndex}"]`
  );
  if (!cell || cell.textContent !== "") return;

  const span = document.createElement("span");
  span.textContent = symbol;
  span.className = symbol;
  cell.appendChild(span);

  boards[boardIndex][cellIndex] = symbol;

  if (isLocal) {
    sendMove(boardIndex, cellIndex);
    isMyTurn = false;
    nextAllowedBoard = boardWinners[cellIndex] ? -1 : cellIndex;
  }

  const winner = checkWinner(boards[boardIndex]);
  if (winner && !boardWinners[boardIndex]) {
    boardWinners[boardIndex] = winner;
    const boardElem = document.querySelector(`#mainTttCell${boardIndex + 1}`);
    const overlay = boardElem.querySelector(".winner-overlay");
    if (overlay) overlay.textContent = winner;
    boardElem.classList.add("won");

    const bigWinner = checkWinner(boardWinners);
    if (bigWinner) {
      showWinnerPopup(bigWinner);
    }
  }
}

function checkWinner(cells) {
>>>>>>> ca177b9 (adding online game mode)
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
<<<<<<< HEAD

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

=======
  for (const [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

function TicTacToe(smallGameIndex) {
  const wrapper = document.createElement("div");
  wrapper.className = "ticTacToe-wrapper";

  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement("div");
    cell.className = "ticTacToe ticTacToe-" + i;
    cell.setAttribute("data-small-game-index", smallGameIndex - 1);
    cell.setAttribute("data-cell-index", i - 1);

    cell.addEventListener("click", () => {
      const boardIndex = smallGameIndex - 1;
      const boardElem = document.querySelector(`#mainTttCell${boardIndex + 1}`);
      if (!isMyTurn || cell.textContent !== "" || boardElem.classList.contains("won")) return;
      if (nextAllowedBoard !== -1 && boardIndex !== nextAllowedBoard) return;
      placeMove(boardIndex, i - 1, mySymbol, true);
    });

    wrapper.appendChild(cell);
  }

  return wrapper;
}

window.onload = () => {
  buildBoard();
  const input = document.getElementById("chatInput");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChat();
  });
};
>>>>>>> ca177b9 (adding online game mode)
