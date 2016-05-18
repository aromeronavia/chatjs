'use strict';

const serverMessageBuilder = function(args) {
  const message = args.message;
  const sender = args.sender;
  const receiver = args.receiver;
  const transactionId = args.transactionId;

  const response = `<message>` +
                      `<id>${transactionId}</id>` +
                      `<client>${sender}</client>` +
                      `<message>${message}</message>` +
                      `<receiver>${receiver}</receiver>` +
                   `</message>

  return response;
};

module.exports = serverMessageBuilder;
