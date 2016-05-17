'use strict';

const _ = require('lodash');

const USER_EXISTS = {
  code: 500,
  message: 'user already exists'
};

class State {
  constructor() {
    this.connectedUsers = [];
  }

  addUser(user) {
    const username = user.user;
    if (this._userExists(username)) return USER_EXISTS;
    this.connectedUsers.push(user);
    return this.requestUsers();
  }

  removeUser(user) {
    _.remove(this.connectedUsers, (item) => {
      return item.user === user;
    });

    return this.requestUsers();
  }

  requestUsers() {
    const userList = this.connectedUsers.map((user) => {
      return user.user;
    });

    return userList;
  }

  _userExists(user) {
    const userFound = _.find(this.connectedUsers, (userObject) => {
      return userObject.name === user;
    });

    return userFound;
  }
}

module.exports = State;
