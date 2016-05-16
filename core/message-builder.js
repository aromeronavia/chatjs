'use strict';

const buildMessage = function(args) {
  const message = args.message;
  const sender = args.sender;
  const receiver = args.receiver;
  const hour = args.hour;
  const transactionId = args.transactionId;

  if (!transactionId || !message || !sender || !receiver || !hour) {
    throw Error('Args are not complete');
  }

  const result = `<message id="${transactionId}">` +
            `<sender>${sender}</sender>` +
            `<receiver>${receiver}</receiver>` +
            `<message>${message}</message>` +
            `<hour>${hour}</hour>` +
          `</message>`;

  return result;
};

module.exports = buildMessage;

