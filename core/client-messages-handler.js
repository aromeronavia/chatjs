'use strict';

const responseFactory = require('./response-builder-factory');
const parseString = require('xml2js').parseString;
const moment = require('moment');

class ClientMessagesHandler {
  constructor(state) {
    this.state = state;
  }

  handleMessage(message, callback) {
    this._parseClientMessage(message, (error, response) => {
      return callback(null, response);
    });
  }

  _parseClientMessage(message, callback) {
    parseString(message, (error, response) => {
      const type = this._getType(response);
      console.log(response);
      if (type === 'message') return this._parseMessage(response, callback);
      if (type === 'users') return this._getUsers(response, callback);
      if (type === 'ack') return callback(null, {status: 'ok'});
    });
  }

  _getType(parsedXML) {
    return Object.keys(parsedXML)[0];
  }

  _parseMessage(parsedXML, callback) {
    const message = this._getMessage(parsedXML);
    const sender = this._getSender(parsedXML);
    const receiver = this._getReceiver(parsedXML);
    const transactionId = this._getTransactionIdFromMessage(parsedXML);
    const hour = moment().format('hh:mm:ss');

    const messageArgs = {
      message: message,
      sender: sender,
      receiver: receiver,
      transactionId: transactionId,
      hour: hour
    };

    const buildMessage = responseFactory('message');
    return callback(null, buildMessage(messageArgs));
  }

  _getMessage(parsedXML) {
    return parsedXML.message.message;
  }

  _getSender(parsedXML) {
    return parsedXML.message.sender;
  }

  _getReceiver(parsedXML) {
    return parsedXML.message.receiver;
  }

  _getTransactionIdFromMessage(parsedXML) {
    return parsedXML.message.$.id;
  }

  _getUsers(xmlObject, callback) {
    const buildUsersList = responseFactory('users');
    const transactionId = this._getTransactionId(xmlObject);
    const users = this.state.requestUsers();
    const args = {
      transactionId: transactionId,
      users: users
    };

    const response = buildUsersList(args);
    return callback(null, response);
  }

  _getTransactionId(xmlObject) {
    return xmlObject.users.$.id;
  }
}

module.exports = ClientMessagesHandler;

