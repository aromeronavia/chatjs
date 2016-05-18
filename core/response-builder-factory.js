'use strict';

const messageBuilder = require('./message-builder');
const acknowledgeBuilder = require('./acknowledge-builder');
const usersListBuilder = require('./users-list-builder.js');
const fileBuilder = require('./file-builder.js');

const serverMessageBuilder = require('./server-message-builder.js');
const serverAcknowledgeBuilder = require('./server-acknowledge-builder.js');
const serverUsersListBuilder = require('./server-users-list-builder.js');

const responseBuilderFactory = function(type, client) {
  if (type === 'message') {
    if (client === 'client') return messageBuilder;
    return serverMessageBuilder;
  }
  if (type === 'users') {
    if (client === 'client') return usersListBuilder;
    return serverUsersListBuilder;
  }

  if (type === 'acknowledge') {
    if (client === 'client') return acknowledgeBuilder;
    return serverAcknowledgeBuilder;
  }

  if (type === 'file') return fileBuilder;

  throw new Error(`type ${type} not supported`);
};

module.exports = responseBuilderFactory;

