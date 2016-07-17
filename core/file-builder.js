'use strict';

const buildFileMessage = function(args) {
  const sender = args.sender;
  const receiver = args.receiver;
  const file = args.file;
  const transactionId = args.transactionId;

  if (!transactionId || !file || !sender || !receiver) {
    throw new Error('Args are not complete');
  }

  const result = `<file id="${transactionId}">` +
                    `<sender>${sender}</sender>` +
                    `<receiver>${receiver}</receiver>` +
                    `<file>${file}</file>` +
                  `</file>`;

  return result;
};

module.exports = buildFileMessage;
