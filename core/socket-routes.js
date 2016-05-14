'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const State = require('./state');
let state = new State();

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

io.on('connect', (data) => {
  const user = data.user;
  const response = state.addUser(user);
  io.push(respose);
});

io.on('request users', () => {
  const activeUsers = state.requestUsers();
  io.push(activeUsers);
});

io.on('disconnect', (data) => {
  const user = data.user;
  const response = state.requestUsers();
  io.push(response);
});

io.on('broadcast', (data) => {
  const message = data.message;
  io.broadcast(message);
})

io.on('send message to user', (data) => {
  const message = buildMessage(data);
  io.push(data);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
