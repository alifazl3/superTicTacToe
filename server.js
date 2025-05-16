const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });

let players = [];

server.on("connection", socket => {
  if (players.length >= 2) {
    socket.send(JSON.stringify({ type: "full" }));
    socket.close();
    return;
  }

  players.push(socket);
  const symbol = players.length === 1 ? "X" : "O";
  socket.send(JSON.stringify({ type: "assign", player: symbol }));

  socket.on("message", data => {
    for (let other of players) {
      if (other !== socket && other.readyState === WebSocket.OPEN) {
        console.log("📤 Sending to other:", data.toString());
        other.send(data);
      }
    }
  });

  socket.on("close", () => {
    players = players.filter(p => p !== socket);
  });
});