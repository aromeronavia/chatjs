'use strict';

const chai = require('chai');
const expect = chai.expect;
const buildMessage = require('./../../core/message-builder');
const ERROR_MESSAGE = 'Args are not complete';

const EXPECTED_MESSAGE =
  `<message id="1">` +
    `<sender>Alberto</sender>` +
    `<receiver>Memo</receiver>` +
    `<message>message</message>` +
    `<hour>12:00:00PM</hour>` +
  `</message>`;

describe('#MessageBuilder', () => {
  it('should return a valid XML', (done) => {
    const args = {
      transactionId: 1,
      message: 'message',
      sender: 'Alberto',
      receiver: 'Memo',
      hour: '12:00:00PM'
    };

    const message = buildMessage(args);
    expect(message).to.be.equal(EXPECTED_MESSAGE);
    done();
  });

  it('should throw an error with incomplete args', (done) => {
    const args = {
      transactionId: 1,
      message: 'message',
      sender: 'Alberto'
    };

    let message;
    try {
      message = buildMessage(args);
    } catch(error) {
      expect(error).to.exist;
      expect(error.message).to.be.equal(ERROR_MESSAGE);
      done();
    }
  })
});
