'use strict';

const buildMessage = require('./message-builder');

class SendMessage {
  constructor(args) {
    this.data = args;
    this.data.hour = this._getHour();
  }

  sendMessage() {
    const message = this._formatMessage();
    console.log('send ', message);
  }

  _formatMessage() {
    return buildMessage(this.data);
  }

  _getHour() {
    return '12:00:00PM';
  }
}

module.exports = SendMessage;
