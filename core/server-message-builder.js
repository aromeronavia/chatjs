'use strict';

const serverMessageBuilder = function(args) {
  const message = args.message;
  const sender = args.sender;
  const receiver = args.receiver;
  const transactionId = args.transactionId;

  const response = `<message>` +
                      `<id>${transactionId}</id>` +
                      `<client>${sender}</client>` +
                      `<receiver>${receiver}</receiver>` +
                      `<message>${message}</message>` +
                   `</message>`;

  return response;
};

module.exports = serverMessageBuilder;
