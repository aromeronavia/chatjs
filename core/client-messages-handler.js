'use strict';

const responseFactory = require('./response-builder-factory.js');
const parseString = require('xml2js').parseString;
const moment = require('moment');

class ClientMessagesHandler {
  constructor(state) {
    this.state = state;
  }

  handleMessage(args, callback) {
    const port = args.port;
    if (this._messageComesFromServer(port)) {
      console.log('SaaServer', port);
      this._parseClientMessage(args, 'server', (error, response) => {
        return callback(error, response);
      });
    } else {
      this._parseClientMessage(args, 'client', (error, response) => {
        return callback(error, response);
      });
    }
  }

  _messageComesFromServer(port) {
    return port === 9930;
  }

  _parseClientMessage(args, client, callback) {
    const message = args.message;
    parseString(message, (error, response) => {
      const type = this._getType(response);
      if (type === 'heartbeat') return this._assertUser(args, client, callback);
      if (type === 'file') return this._sendFile(response, callback);
      if (type === 'adduser') {
        const addUserArgs = {
          parsedXML: response,
          ip: args.ip,
          port: args.port
        };
        return this._addUser(addUserArgs, client, callback);
      }
      if (type === 'message') return this._handleMessage(response, client, callback);
      if (type === 'users') return this._getUsers(response, client, callback);
      if (type === 'ack') return callback(null, {status: 'ok'});
    });
  }

  _handleMessage(parsedXML, client, callback) {
    const type = 'message';
    const receiver = this._getReceiver(parsedXML, type);
    const builtMessage = this._buildMessage(parsedXML, client, type);
    const transactionId = this._getTransactionId(parsedXML, type);
    if (receiver === 'all') return this._broadcastMessage(builtMessage, callback);

    return this._sendMessage(builtMessage, receiver, callback, transactionId);
  }

  _sendFile(parsedXML, callback) {
    const type = 'file';
    const buildFileMessage = responseFactory(type);

    const file = this._getFile(parsedXML, type);
    const sender = this._getSender(parsedXML, type);
    const receiver = this._getReceiver(parsedXML, type);
    const transactionId = this._getTransactionId(parsedXML, type);

    const messageArgs = {
      file: file,
      sender: sender,
      receiver: receiver,
      transactionId: transactionId
    };

    const builtMessage = buildFileMessage(messageArgs);
    return this._sendMessage(builtMessage, receiver, callback, transactionId);
  }

  _getFile(parsedXML, type) {
    return parsedXML[type].file[0];
  }

  _buildMessage(parsedXML, client) {
    const type = 'message';
    const buildMessage = responseFactory(type, client);

    const message = this._getMessage(parsedXML, type);
    const sender = this._getSender(parsedXML, type);
    const receiver = this._getReceiver(parsedXML, type);
    const transactionId = this._getTransactionId(parsedXML, type);
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

  _sendMessage(builtMessage, receiver, callback, transactionId) {
    const buildAcknowledge = responseFactory('acknowledge');
    let receiverAddress;
    try {
      receiverAddress = this.state.getAddressFromUser(receiver);
    } catch (error) {
      return callback(error);
    }

    const acknowledge = buildAcknowledge({transactionId: transactionId});
    const response = {
      intent: 'send',
      message: builtMessage,
      ip: receiverAddress.ip,
      port: receiverAddress.port,
      acknowledge: acknowledge
    };

    console.log('jaja saludos', response);

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

  _getUsers(xmlObject, client, callback) {
    const type = 'users';

    const buildUsersList = responseFactory(type, client);
    const transactionId = this._getTransactionId(xmlObject, type);
    const users = this.state.requestUsers();
    const args = {
      transactionId: transactionId,
      users: users
    };

    const response = {
      intent: 'reply',
      message: buildUsersList(args)
    };
    return callback(null, response);
  }

  _addUser(args, client, callback) {
    const type = 'users';
    const buildUsersList = responseFactory(type, client);
    const parsedXML = args.parsedXML;
    const user = this._getUser(parsedXML);
    const transactionId = this._getTransactionId(parsedXML, 'adduser');

    const addUserArgs = {
      user: user,
      ip: args.ip,
      port: args.port,
      hour: moment().format('hh:mm:ss')
    };

    const userList = this.state.addUser(addUserArgs);
    const buildListArgs = {
      transactionId: transactionId,
      users: userList
    };

    const response = {
      intent: 'reply',
      message: buildUsersList(buildListArgs)
    };
    return callback(null, response);
  }

  _assertUser(args, client, callback) {
    const ip = args.ip;
    const port = args.port;
    this.state.assertUser(ip, port);
    return callback(null, { intent: 'none' });
  }

  _getUser(xmlObject) {
    return xmlObject.adduser._;
  }

  getAllUsersAdresses() {
    return this.state.getAllAddresses();
  }

  _getMessage(parsedXML, type) {
    return parsedXML[type].message[0];
  }

  _getSender(parsedXML, type) {
    return parsedXML[type].sender[0];
  }

  _getReceiver(parsedXML, type) {
    return parsedXML[type].receiver[0];
  }

  _getTransactionId(xmlObject, type) {
    return xmlObject[type].$.id;
  }

  _getType(parsedXML) {
    return Object.keys(parsedXML)[0];
  }
}

module.exports = ClientMessagesHandler;
