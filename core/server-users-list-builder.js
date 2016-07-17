const buildUsersList = function(args) {
  const transactionId = args.transactionId;
  const users = args.users;
  const formattedUsers = users.join('-');

  const result = `<clientList>` +
                    `<id>${transactionId}</id>` +
                    `<clientList>${formattedUsers}</clientList>` +
                 `</clientList>`;

  return result;
};

module.exports = buildUsersList;
