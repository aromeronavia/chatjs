'use strict';

const _ = require('lodash');

class State {
  constructor() {
    this.connectedUsers = [];
  }

  addUser(user) {
    this.connectedUsers.push(user);
    return this.connectedUsers;
  }

  removeUser(user) {
    if(this._userExists(user)) {
      _.remove(this.connectedUsers, (item) => {
        return item === user;
      });

      return this.connectedUsers;
    }
  }

  _userExists(user) {
    return this.connectedUsers.indexOf(user) > -1;
  }
}

module.exports = State;
