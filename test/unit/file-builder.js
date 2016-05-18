'use strict';

const chai = require('chai');
const expect = chai.expect;
const buildFileMessage = require('./../../core/file-builder.js');
const EXPECTED_FILE_MESSAGE = '<file id="2"><sender>sender</sender><receiver>receiver</receiver><file>file</file></file>';

describe('#buildFileMessage', () => {
  it('should return a valid file XML', () => {
    const args = {
      file: 'file',
      transactionId: 2,
      sender: 'sender',
      receiver: 'receiver'
    };
    const response = buildFileMessage(args);
    expect(response).to.be.equal(EXPECTED_FILE_MESSAGE);
  });
});
