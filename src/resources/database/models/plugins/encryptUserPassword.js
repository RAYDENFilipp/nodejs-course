const bcrypt = require('bcrypt');

const encryptUserPassword = (schema, saltRounds = 8) => {
  // eslint-disable-next-line func-names
  schema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  // eslint-disable-next-line func-names
  schema.methods.encryptPassword = async function(password) {
    this.password = await bcrypt.hash(password, saltRounds);
  };

  schema.post('validate', async (model, next) => {
    const password = model.password;
    try {
      await model.encryptPassword(password);

      return next();
    } catch (e) {
      return next(e);
    }
  });
};

module.exports = encryptUserPassword;
