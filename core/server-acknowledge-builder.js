'use strict';

const buildAcknowledge = function(args) {
  const transactionId = args.transactionId;
  const result = `<confirmation>` +
                    `<id>${transactionId}</id>` +
                    `<message></message>` +
                  `</confirmation>`;

  return result;
};

module.exports = buildAcknowledge;
