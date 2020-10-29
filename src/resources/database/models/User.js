const { model, Schema } = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');
const encryptUserPassword = require('./plugins/encryptUserPassword');

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    login: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      private: true
    }
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

userSchema.plugin(toJson).plugin(encryptUserPassword);

module.exports = model('User', userSchema);
