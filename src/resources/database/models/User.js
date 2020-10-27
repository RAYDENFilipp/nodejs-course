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

userSchema.post(/save|find/, userData => {
  if (Array.isArray(userData)) {
    userData.forEach(user => (user.password = undefined));
  } else {
    userData.password = undefined;
  }

  return userData;
});

module.exports = model('User', userSchema);
