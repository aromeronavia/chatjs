'use strict';

const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');

const State = require('./../../core/state');

describe('#State', () => {
  let state;

  beforeEach(() => {
    state = new State();
  });

  it('should add an user and return the list of users', () => {
    const user = {
      user: 'alberto',
      ip: '123.123.123.123',
      port: 1234
    };

    const listUsers = state.addUser(user);
    expect(listUsers[0]).to.be.equal(user.user);
  });

  it('should remove an existent user from the list', () => {
    const user = 'alberto';
    const listOfUsers = ['alberto', 'roberto', 'pablo', 'vakero'];
    const expectedList = ['roberto', 'pablo', 'vakero'];
    listOfUsers.forEach((user) => {
      state.addUser({
        user: user,
        ip: '123.123.123.123',
        port: 1234
      });
    });

    const resultList = state.removeUser(user);
    expect(_.isEqual(resultList, expectedList)).to.be.equal(true);
  });
});
