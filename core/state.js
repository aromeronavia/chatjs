'use strict';

const _ = require('lodash');

const USER_EXISTS = {
  code: 500,
  message: 'user already exists'
}

class State {
  constructor() {
    this.connectedUsers = [];
  }

  addUser(user) {
    if (this._userExists(user)) return USER_EXISTS;
    this.connectedUsers.push(user);
    return this.connectedUsers;
  }

  removeUser(user) {
    _.remove(this.connectedUsers, (item) => {
      return item === user;
    });

    return this.connectedUsers;
  }

  requestUsers() {
    return this.connectedUsers;
  }

  _userExists(user) {
    return this.connectedUsers.indexOf(user) > -1;
  }
}

module.exports = State;
