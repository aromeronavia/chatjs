'use strict';

const chai = require('chai');
const expect = chai.expect;
const State = require('./../../core/state.js');
const ClientMessagesHandler = require('./../../core/client-messages-handler.js');
const _ = require('lodash');

const EXPECTED_USERS_LIST_RESPONSE = '<users id="1"><user>alberto</user><user>roberto</user></users>';

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
    state.addUser('alberto');
    state.addUser('roberto');
    controller.handleMessage(clientMessage, (error, response) => {
      if (error) return done(error);
      expect(response).to.be.equal(EXPECTED_USERS_LIST_RESPONSE);
      done();
    });
  });

  it('should give a valid response for a message request', (done) => {
    const clientMessage = '<message id="1">' +
                            '<sender>alberto</sender>' +
                            '<receiver>roberto</receiver>' +
                            '<message>quepedo</message>' +
                          '</message>';

    controller.handleMessage(clientMessage, (error, response) => {
      if (error) return done(error);
      expect(response).to.exist;
      done();
    });
  });

  it('should give a valid response for an ack message', (done) => {
    const clientMessage = '<ack id="1" />';

    controller.handleMessage(clientMessage, (error, response) => {
      if (error) return done(error);
      expect(_.isEqual(response, EXPECTED_ACK_RESPONSE)).to.be.equal(true);
      done();
    });
  });
});

