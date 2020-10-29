const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { StatusCodes } = require('http-status-codes');

const User = require('../../database/dao/user');
const { JWT_SECRET_KEY } = require('../../../common/config');
const ServerResponseError = require('./error/ServerResponseError');

const promisifiedJWTSign = promisify(jwt.sign);

const loginMiddleware = async (req, res) => {
  const { login, password } = req.body;

  const [existingUser] = await User.getAll({ login });
  const isAccessGranted =
    existingUser && (await existingUser.comparePassword(password));

  if (isAccessGranted) {
    const { id } = existingUser;
    const token = await promisifiedJWTSign(
      { login, userId: id },
      JWT_SECRET_KEY,
      {
        expiresIn: '1m'
      }
    );

    res.json({ token });
  } else {
    throw new ServerResponseError(StatusCodes.FORBIDDEN);
  }
};

module.exports = loginMiddleware;
