'use strict';

const responseFactory = require('./response-builder-factory.js');
const parseString = require('xml2js').parseString;
const moment = require('moment');

class ClientMessagesHandler {
  constructor(state) {
    this.state = state;
  }

  handleMessage(args, callback) {
    this._parseClientMessage(args, (error, response) => {
      return callback(error, response);
    });
  }

  _parseClientMessage(args, callback) {
    const message = args.message;
    parseString(message, (error, response) => {
      const type = this._getType(response);
      if (type === 'heartbeat') return this._assertUser(args);
      if (type === 'file') return this._sendFile(args);
      if (type === 'adduser') {
        const addUserArgs = {
          parsedXML: response,
          ip: args.ip,
          port: args.port
        };
        return this._addUser(addUserArgs, callback);
      }
      if (type === 'message') return this._handleMessage(response, callback);
      if (type === 'users') return this._getUsers(response, callback);
      if (type === 'ack') return callback(null, {status: 'ok'});
    });
  }

  _handleMessage(parsedXML, callback) {
    const receiver = this._getReceiver(parsedXML);
    const builtMessage = this._buildMessage(parsedXML);
    if (receiver === 'all') return this._broadcastMessage(builtMessage, callback);

    return this._sendMessage(builtMessage, receiver, callback);
  }

  _sendFile(args) {

  }

  _buildMessage(parsedXML) {
    const buildMessage = responseFactory('message');

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

    const builtMessage = buildMessage(messageArgs);
    return builtMessage;
  }

  _sendMessage(builtMessage, receiver, callback) {
    let receiverAddress;
    try {
      receiverAddress = this.state.getAddressFromUser(receiver);
    } catch (error) {
      return callback(error);
    }

    const response = {
      intent: 'send',
      message: builtMessage,
      ip: receiverAddress.ip,
      port: receiverAddress.port
    };

    return callback(null, response);
  }

  _broadcastMessage(builtMessage, callback) {
    const allAddresses = this.getAllUsersAdresses();
    const message = allAddresses.map((obj) => {
      return {
        message: builtMessage,
        ip: obj.ip,
        port: obj.port
      };
    });

    const response = {
      intent: 'broadcast',
      message: message
    };

    return callback(null, response);
  }

  _getUsers(xmlObject, callback) {
    const buildUsersList = responseFactory('users');
    const transactionId = this._getTransactionId(xmlObject);
    const users = this.state.requestUsers();
    const args = {
      transactionId: transactionId,
      users: users
    };

    const response = {
      intent: 'send',
      message: buildUsersList(args)
    };
    return callback(null, response);
  }

  _addUser(args, callback) {
    const buildUsersList = responseFactory('users');
    const parsedXML = args.parsedXML;
    const user = this._getUser(parsedXML);
    const addUserArgs = {
      user: user,
      ip: args.ip,
      port: args.port
    };

    const transactionId = this._getTransactionIdFromAddUser(parsedXML);
    const userList = this.state.addUser(addUserArgs);
    const buildListArgs = {
      transactionId: transactionId,
      users: userList
    };

    const response = {
      intent: 'send',
      message: buildUsersList(buildListArgs)
    };
    return callback(null, response);
  }

  _getUser(xmlObject) {
    return xmlObject.adduser._;
  }

  _getTransactionIdFromAddUser(xmlObject) {
    return xmlObject.adduser.$.id;
  }

  getAllUsersAdresses() {
    return this.state.getAllAddresses();
  }

  _getMessage(parsedXML) {
    return parsedXML.message.message[0];
  }

  _getSender(parsedXML) {
    return parsedXML.message.sender[0];
  }

  _getReceiver(parsedXML) {
    return parsedXML.message.receiver[0];
  }

  _getTransactionId(xmlObject) {
    return xmlObject.users.$.id;
  }

  _getTransactionIdFromMessage(parsedXML) {
    return parsedXML.message.$.id;
  }

  _getType(parsedXML) {
    return Object.keys(parsedXML)[0];
  }
}

module.exports = ClientMessagesHandler;
