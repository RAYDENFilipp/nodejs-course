const { model, Schema } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    login: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

module.exports = model('User', userSchema);
