'use strict';

const chai = require('chai');
const expect = chai.expect;
const usersListBuilder = require('./../../core/users-list-builder');

const EXPECTED_RESULT = '<users id="12">' +
                           '<user>alberto</user>' +
                           '<user>roberto</user>' +
                        '</users>';

describe('#UsersListBuilder', () => {
  it('should return a valid XML with the users', (done) => {
    const args = {
      transactionId: 12,
      users: ['alberto', 'roberto']
    };

    const usersList = usersListBuilder(args);
    expect(usersList).to.be.equal(EXPECTED_RESULT);
    done();
  });
});

