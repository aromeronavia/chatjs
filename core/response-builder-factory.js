'use strict';

const messageBuilder = require('./message-builder');
const acknowledgeBuilder = require('./acknowledge-builder');
const usersListBuilder = require('./users-list-builder.js');

const responseBuilderFactory = function(type) {
  if (type === 'message') return messageBuilder;
  if (type === 'users') return usersListBuilder;
  if (type === 'ack') return acknowledgeBuilder;

  throw new Error(`type ${type} not supported`);
};

module.exports = responseBuilderFactory;

