/*jshint esversion: 6 */
"use strict";

const buildAcknowledge = function(args) {
  const transactionId = args.transactionId;
  const result = `<ack id="${transactionId}" />`;

  return result;
};

module.exports = buildAcknowledge;

