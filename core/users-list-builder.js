'use strict';

const buildUsersList = function(args) {
  const transactionId = args.transactionId;
  const users = args.users;
  let formattedUsers = '';
  users.forEach((user) => {
    formattedUsers += `<user>${user}</user>`;
  });

  const result = `<users id="${transactionId}">` +
           formattedUsers +
         `</users>`;

  return result;
};

module.exports = buildUsersList;

