'use strict';

const chai = require('chai');
const expect = chai.expect;
const buildAcknowledge = require('./../../core/acknowledge-builder');
const EXPECTED_ACKNOWLEDGE = '<ack id="1" />';

describe('#AcknowledgeBuilder', () => {
  it('should return a valid acknowledge XML', () => {
    const args = {
      transactionId: 1
    };

    const acknowledge = buildAcknowledge(args);
    expect(acknowledge).to.be.equal(EXPECTED_ACKNOWLEDGE);
  });
});

