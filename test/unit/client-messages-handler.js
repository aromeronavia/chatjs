'use strict';

const chai = require('chai');
const expect = chai.expect;
const State = require('./../../core/state.js');
const ClientMessagesHandler = require('./../../core/client-messages-handler.js');
const _ = require('lodash');

const EXPECTED_USERS_LIST_RESPONSE = '<users id="1"><user>alberto</user><user>roberto</user></users>';

const MESSAGE_REGEX = new RegExp(/<message id="1"><sender>.*<\/sender><receiver>.*<\/receiver><message>.*<\/message><hour>\d\d:\d\d:\d\d<\/hour><\/message>/);

const EXPECTED_ACK_RESPONSE = {status: 'ok'};

describe('#ClientMessagesHandler', () => {
  let state;
  let controller;

  beforeEach(() => {
    state = new State();
    controller = new ClientMessagesHandler(state);
  });

  it('should give a valid response for a get users request', (done) => {
    const clientMessage = '<users id="1" hola="mundo">holi</users>';
    state.addUser({
      user: 'alberto',
      ip: '123.123.123.123',
      port: 456
    });

    state.addUser({
      user: 'roberto',
      ip: '123.123.123.123',
      port: 456
    });

    const args = {
      message: clientMessage,
      ip: '123.123.123.123',
      port: 455
    };

    controller.handleMessage(args, (error, response) => {
      if (error) return done(error);
      expect(response.message).to.be.equal(EXPECTED_USERS_LIST_RESPONSE);
      done();
    });
  });

  it('should throw an error response for a message request if no user is in the State', (done) => {
    const clientMessage = '<message id="1">' +
                            '<sender>alberto</sender>' +
                            '<receiver>roberto</receiver>' +
                            '<message>quepedo</message>' +
                          '</message>';

    const args = {
      message: clientMessage,
      ip: '123.123.123.123',
      port: 455
    };

    controller.handleMessage(args, (error, response) => {
      expect(error).to.exist;
      done();
    });
  });

  it('should give a valid response for an ack message', (done) => {
    const clientMessage = '<ack id="1" />';

    const args = {
      message: clientMessage,
      ip: '123.123.123.123',
      port: 455
    };

    controller.handleMessage(args, (error, response) => {
      if (error) return done(error);
      expect(_.isEqual(response, EXPECTED_ACK_RESPONSE)).to.be.equal(true);
      done();
    });
  });

  it('should add a user and return the user list', (done) => {
    const clientMessage = '<adduser id="1">alberto</adduser>';
    const EXPECTED_USERS_LIST = '<users id="1"><user>alberto</user></users>';

    const args = {
      message: clientMessage,
      ip: '123.123.123.123',
      port: 455
    };

    controller.handleMessage(args, (error, response) => {
      if (error) return done(error);

      expect(response.message === EXPECTED_USERS_LIST).to.be.equal(true);
      done();
    });
  });

  it('should deliver a formed message to a user with its ip and port', (done) => {
    const clientMessage = '<message id="1">' +
                            '<sender>alberto</sender>' +
                            '<receiver>roberto</receiver>' +
                            '<message>quepedo</message>' +
                          '</message>';
    state.addUser({
      user: 'roberto',
      ip: '123.123.123.123',
      port: 456
    });

    const args = {
      message: clientMessage,
      ip: '127.0.0.1',
      port: 4000
    }

    controller.handleMessage(args, (error, response) => {
      expect(MESSAGE_REGEX.test(response.message)).to.be.equal(true);
      done();
    });
  });
});
