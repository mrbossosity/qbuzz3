const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', socket => {
  socket.on("join-room", (player, room) => {
    socket.join(room)
    socket.to(room).emit("player-join", player)
  })

  socket.on("player-buzz", (player, room) => {
    socket.to(room).emit("buzzer-lockout", player)
  })

  socket.on("mod-clear", room => {
    socket.to(room).emit("buzzer-clear")
  })

  socket.on("leave-room", (player, room) => {
    socket.leave(room);
    socket.to(room).emit("player-leave", player)
  })
})

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});