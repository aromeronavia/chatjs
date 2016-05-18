'use strict';

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const ClientMessagesHandler = require('./client-messages-handler.js');
const State = require('./state.js');
let state = new State();

let messagesHandler = new ClientMessagesHandler(state);

const heartBeat = function () {
  setInterval(() => {
    console.log('each second');
    const message = '<heartbeat />';
    const args = prepareMessageForBroadcast(message);
    broadcastMessage(args);
  }, 1000);
};

const prepareMessageForBroadcast = function (message) {
  const addresses = state.getAllAddresses();
  const args = {
    message: addresses.map((address) => {
      return {
        message: message,
        ip: address.ip,
        port: address.port
      };
    })
  };
  console.log(args);
  return args;
};

const sendMessage = function(response, address, port) {
  const portToReply = response.port || port;
  const addressToReply = response.ip || address;
  const reply = new Buffer('' + response.message);
  console.log('sending reply', reply);
  socket.send(reply, 0, reply.length, portToReply, addressToReply, (err) => {
    console.log('error', err);
  });
};

const broadcastMessage = function(args, address, port) {
  const messages = args.message;
  messages.forEach((message) => {
    const portToReply = message.port || port;
    const addressToReply = message.ip || address;
    const reply = new Buffer('' + message.message);
    console.log('reply broadcast', reply + '');
    socket.send(reply, 0, reply.length, portToReply, addressToReply, (err) => {
      console.log('error', err);
    });
  });
};

const deliverResponse = function(error, response, address, port) {
  if (error) {
    console.error(error);
    return;
  }

  console.log('response to deliver', response);
  const intent = response.intent;
  if (intent === 'send') sendMessage(response, address, port);
  else if (intent === 'broadcast') broadcastMessage(response, address, port);
  else if (intent === 'sendAndAcknowledge') sendAndAcknowledgeMessage(response, address, port);
  else {
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
  heartBeat();
});

socket.bind(9930);

module.exports = socket;
