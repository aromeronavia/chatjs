'use strict';

const State = require('./state');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let state = new State();

const USER_EXISTS = {
  code: 500,
  message: 'user already exists';
}

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

io.on('connect', (data) => {
  const user = data.user;

});

io.on('request users', () => {
  io.push({users: ['1', '2', '3']});
});

io.on('disconnect', (data) => {

});

io.on('broadcast', (data) => {

})

io.on('send message to user', () => {

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
