require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDir));

let count = 0;

io.on("connection", socket => {
  console.log("New Websocket connection");
  socket.on("increment", () => {
    count++;
    io.emit("countUpdated", count);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
