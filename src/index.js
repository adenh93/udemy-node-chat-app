require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const filter = new Filter();

app.use(express.static(publicDir));

io.on("connection", socket => {
  console.log("New WebSocket connection");

  socket.emit("message", generateMessage("Welcome to the chat app!"));
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("sendMessage", (message, callback) => {
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }
    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () =>
    io.emit("message", generateMessage("A user has left!"))
  );
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
