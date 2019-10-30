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

io.on("connection", () => {
  console.log("New Websocket connection");
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});