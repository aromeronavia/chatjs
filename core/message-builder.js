'use strict';

const buildMessage = function(args) {
  const message = args.message;
  const sender = args.sender;
  const receiver = args.receiver;
  const hour = args.hour;

  if (!message || !sender || !receiver || !hour) {
    throw Error('Args are not complete');
  }

  return `<message>` +
            `<sender>${sender}</sender>` +
            `<receiver>${receiver}</receiver>` +
            `<message>${message}</message>` +
            `<hour>${hour}</hour>` +
          `</message>`;
};

module.exports = buildMessage;
