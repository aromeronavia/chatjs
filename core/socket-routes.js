'use strict';

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const ClientMessagesHandler = require('./client-messages-handler.js');
const State = require('./state.js');
let state = new State();

let messagesHandler = new ClientMessagesHandler(state);

const sendMessage = function(response, address, port) {
  const portToReply = response.port || port;
  const addressToReply = response.ip || address;
  const reply = new Buffer('' + response.message);
  socket.send(reply, 0, reply.length, portToReply, addressToReply, (error) => {
    if (error) console.log('error', error);
  });
};

const sendAcknowledge = function(acknowledge, ip, port) {
  sendMessage(acknowledge, ip, port);
};

const broadcastMessage = function(args, address, port) {
  const messages = args.message;
  messages.forEach((message) => {
    const portToReply = message.port || port;
    const addressToReply = message.ip || address;
    const reply = new Buffer('' + message.message);
    socket.send(reply, 0, reply.length, portToReply, addressToReply, (error) => {
      if (error) console.log('error', error);
    });
  });
};

const deliverResponse = function(error, response, address, port) {
  if (error) return console.error(error);

  console.log('response to deliver', response);
  const intent = response.intent;
  if (intent === 'reply') sendMessage(response, address, port);
  else if (intent === 'broadcast') broadcastMessage(response, address, port);
  else if (intent === 'send') {
    sendMessage(response, address, port);
    sendAcknowledge(response.acknowledge, address, port);
  } else {
    console.error('intent', intent, 'is not allowed');
  }
};

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
    deliverResponse(error, response, address, port);
  });
});

socket.on('listening', () => {
  var address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

socket.bind(9940);

module.exports = socket;
