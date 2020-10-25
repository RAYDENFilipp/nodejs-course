const mockdata = require('mockdata');
const { model, Schema } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: mockdata.name()
    },
    login: {
      type: String,
      unique: true,
      default: `${mockdata.name()}${mockdata.chars(1, 5)}`
    },
    password: {
      type: String,
      default: `${mockdata.chars(5, 10)}`
    }
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

module.exports = model('User', userSchema);
