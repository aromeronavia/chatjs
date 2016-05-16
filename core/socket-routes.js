'use strict';

const app = require('express')();
const http = require('http').Server(app);
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const ClientMessagesHandler = require('./client-messages-handler.js');
const State = require('./state.js');
let state = new State();

const messagesHandler = new ClientMessagesHandler(state);

socket.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  socket.close();
});

socket.on('message', (message, rinfo) => {
  const address = rinfo.address;
  const port = rinfo.port;

  console.log(`server got: ${message} from ${address}:${port}`);
  messagesHandler.handleMessage(message, (error, response) => {
    console.log('response to deliver', response);
    socket.send(response, 0, response.length, port, address, (error) => {
      console.log('error', error);
    });
  });
});

socket.on('listening', () => {
  var address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

socket.bind(3001);

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

