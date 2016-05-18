'use strict';

const chai = require('chai');
const expect = chai.expect;
const dgram = require('dgram');

require('./../../core/socket-routes.js');

const MESSAGE_REGEX = new RegExp(/<message id="1"><sender>.*<\/sender><receiver>.*<\/receiver><message>.*<\/message><hour>\d\d:\d\d:\d\d<\/hour><\/message>/);

const PORT = 9940;

describe('#Application routes', () => {
  let socket;
  beforeEach((done) => {
    socket = dgram.createSocket('udp4');
    socket.send(new Buffer('reset'), 0, 5, PORT, '127.0.0.1', () => {});
    done();
  });

  it('should add an user to the state', (done) => {
    const EXPECTED_RESPONSE = '<users id="1"><user>alberto</user></users>';
    socket.on('message', (response) => {
      const message = response + '';
      expect(message).to.be.equal(EXPECTED_RESPONSE);
      done();
    });
    const message = '<adduser id="1">alberto</adduser>';
    socket.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
  });

  it('should get an empty list of users when no users are connected', (done) => {
    const EXPECTED_RESPONSE = '<users id="1"></users>';
    socket.on('message', (response) => {
      const message = response + '';
      expect(message).to.be.equal(EXPECTED_RESPONSE);
      done();
    });
    const message = '<users id="1"></users>';
    socket.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
  });

  it('should add two users and get a list with two users', (done) => {
    const EXPECTED_RESPONSE = '<users id="2"><user>alberto</user><user>roberto</user></users>';
    socket.on('message', (response) => {
      const messageResponse = response + '';
      if (messageResponse === EXPECTED_RESPONSE) done();
    });
    let message = '<adduser id="1">alberto</adduser>';
    socket.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
    message = '<adduser id="2">roberto</adduser>';
    socket.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
  });

  it('should send a message to a specific port', (done) => {
    const socketClient = dgram.createSocket('udp4');
    socketClient.on('message', (response) => {
      const message = response + '';
      if (MESSAGE_REGEX.test(message)) done();
    });

    socketClient.bind(3003);
    let message = '<adduser id="2">roberto</adduser>';
    socketClient.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {
      message = '<message id="1"><sender>alberto</sender><receiver>roberto</receiver><message>quepedo</message></message>';
      socketClient.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
    });
  });

  it('should send a broadcast to all the users in the state', (done) => {
    let numberOfMessagesReceived = 0;
    const socketClient = dgram.createSocket('udp4');
    socketClient.on('message', (response) => {
      const message = response + '';
      console.log('arrived message socket 1', message);
      if (MESSAGE_REGEX.test(message)) {
        numberOfMessagesReceived += 1;
        if (numberOfMessagesReceived === 2) done();
      }
    });

    socketClient.bind(3004);

    const socketClient2 = dgram.createSocket('udp4');
    socketClient2.on('message', (response) => {
      const message = response + '';
      console.log('arrived message socket 2', message);
      if (MESSAGE_REGEX.test(message)) {
        numberOfMessagesReceived += 1;
        if (numberOfMessagesReceived === 2) done();
      }
    });

    socketClient2.bind(3005);

    let addRoberto = '<adduser id="2">roberto</adduser>';
    let addAlberto = '<adduser id="3">alberto</adduser>';
    socketClient.send(new Buffer(addRoberto), 0, addRoberto.length, PORT, '127.0.0.1', () => {});
    socketClient2.send(new Buffer(addAlberto), 0, addAlberto.length, PORT, '127.0.0.1', () => {});
    const message = '<message id="1"><sender>alberto</sender><receiver>all</receiver><message>quepedo</message></message>';
    socketClient.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
  });

  it('should return a valid response knowing the server is calling from a message', (done) => {
    const socketClient = dgram.createSocket('udp4');
    const EXPECTED_SERVER_MESSAGE = '<message><id>1</id><client>alberto</client><receiver>roberto</receiver><message>quepedo</message></message>';
    socketClient.on('message', (response) => {
      const message = response + '';
      console.log('arrived message socket 1', message);
      if (message === EXPECTED_SERVER_MESSAGE) {
        socketClient.close();
        done();
      }
    });

    socketClient.bind(9930);

    let addRoberto = '<adduser id="2">roberto</adduser>';
    socketClient.send(new Buffer(addRoberto), 0, addRoberto.length, PORT, '127.0.0.1', () => {});
    const message = '<message id="1"><sender>alberto</sender><receiver>roberto</receiver><message>quepedo</message></message>';
    socketClient.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
  });

  it('should return a valid response knowing the server is calling from a message', (done) => {
    const socketClient = dgram.createSocket('udp4');
    const EXPECTED_SERVER_MESSAGE = '<clientList><id>1</id><clientList>roberto</clientList></clientList>';
    socketClient.on('message', (response) => {
      const message = response + '';
      console.log('arrived message socket 1', message);
      if (message === EXPECTED_SERVER_MESSAGE) done();
    });

    socketClient.bind(9930);

    let addRoberto = '<adduser id="2">roberto</adduser>';
    socketClient.send(new Buffer(addRoberto), 0, addRoberto.length, PORT, '127.0.0.1', () => {});
    const message = '<users id="1"></users>';
    socketClient.send(new Buffer(message), 0, message.length, PORT, '127.0.0.1', () => {});
  });
});
