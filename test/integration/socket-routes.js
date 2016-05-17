'use strict';

const chai = require('chai');
const expect = chai.expect;
const dgram = require('dgram');

require('./../../core/socket-routes.js');
describe('#Application routes', () => {
  let socket;
  beforeEach((done) => {
    socket = dgram.createSocket('udp4');
    socket.send(new Buffer('reset'), 0, 5, 3001, '127.0.0.1', () => {});
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
    socket.send(new Buffer(message), 0, message.length, 3001, '127.0.0.1', (error) => {
      console.log(error);
    });
  });

  it('should get an empty list of users when no users are connected', (done) => {
    const EXPECTED_RESPONSE = '<users id="1"></users>';
    socket.on('message', (response) => {
      const message = response + '';
      expect(message).to.be.equal(EXPECTED_RESPONSE);
      done();
    });
    const message = '<users id="1"></users>';
    socket.send(new Buffer(message), 0, message.length, 3001, '127.0.0.1', (error) => {
      console.log(error);
    });
  });
});
