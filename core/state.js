'use strict';

const _ = require('lodash');
const moment = require('moment');

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
    const response = this.requestUsers();
    return response;
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

  getAllAddresses() {
    const addresses = this.connectedUsers.map((user) => {
      return {
        ip: user.ip,
        port: user.port
      };
    });

    return addresses;
  }

  _findUserByIpAndPort(ip, port) {
    const user =_.find(this.connectedUsers, (user) => {
      return user.ip === ip && user.port === port;
    });

    return user;
  }

  assertUser(ip, port) {
    const user = this._findUserByIpAndPort(ip, port);
    const hour = moment(user.hour);
    const secondsDiff = hour.diff(moment(), 'seconds', true);
    if (secondsDiff > 10) {
      this.removeUser(user.user);
    }
  }

  getAddressFromUser(user) {
    const userFound = _.find(this.connectedUsers, (userObject) => {
      return userObject.user === user;
    });

    if (!userFound) throw new Error('User is not found');

    const response = {
      ip: userFound.ip,
      port: userFound.port
    };

    return response;
  }

  _userExists(user) {
    const userFound = _.find(this.connectedUsers, (userObject) => {
      return userObject.user === user;
    });

    return userFound;
  }
}

module.exports = State;
