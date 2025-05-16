const WebSocket = require("ws");
const url = require("url");

const server = new WebSocket.Server({ port: 3000 });
const rooms = {};
server.on("connection", (socket, req) => {
  const parameters = url.parse(req.url, true);
  const roomId = parameters.query.room;

  if (!roomId) {
    socket.send(JSON.stringify({ type: "error", message: "No room specified" }));
    socket.close();
    return;
  }

  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }

  if (rooms[roomId].length >= 2) {
    socket.send(JSON.stringify({ type: "full" }));
    socket.close();
    return;
  }

  const symbol = rooms[roomId].length === 0 ? "X" : "O";
  rooms[roomId].push(socket);
  socket.send(JSON.stringify({ type: "assign", player: symbol }));

  socket.on("message", (data) => {
    rooms[roomId].forEach((player) => {
      if (player !== socket && player.readyState === WebSocket.OPEN) {
        player.send(data);
      }
    });
  });
  socket.on("close", () => {
    rooms[roomId] = rooms[roomId].filter(p => p !== socket);
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }
  });
});