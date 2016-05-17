'use strict';

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const ClientMessagesHandler = require('./client-messages-handler.js');
const State = require('./state.js');
let state = new State();

let messagesHandler = new ClientMessagesHandler(state);

socket.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  socket.close();
});

socket.on('message', (message, rinfo) => {
  if ('' + message === 'reset') {
    state = new State();
    messagesHandler = new ClientMessagesHandler(state);
    return;
  }

  const address = rinfo.address;
  const port = rinfo.port;
  const args = {
    message: '' + message,
    ip: address,
    port: port
  };

  console.log(`server got: ${message} from ${address}:${port}`);
  messagesHandler.handleMessage(args, (error, response) => {
    console.log('response to deliver', response);
    const portToReply = response.port || port;
    const addressToReply = response.ip || address;
    const reply = new Buffer('' + response.message);
    socket.send(reply, 0, reply.length, portToReply, addressToReply, (err) => {
      console.log('error', err);
    });
  });
});

socket.on('listening', () => {
  var address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

socket.bind(3001);

module.exports = socket;
