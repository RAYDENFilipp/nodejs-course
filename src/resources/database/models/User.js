const { model, Schema } = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

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
      required: true,
      private: true
    }
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

userSchema.plugin(toJson);

module.exports = model('User', userSchema);
