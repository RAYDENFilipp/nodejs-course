const mockdata = require('mockdata');
const User = require('./user.model');

const users = new Array(10);

for (let i = 0; i < users.length; i++) {
  users[i] = new User({
    name: mockdata.name(),
    login: `${mockdata.name()}${mockdata.chars(1, 5)}`,
    password: `${mockdata.chars(5, 10)}`
  });
}

const getAll = async () => {
  return users;
};

module.exports = { getAll };
