const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { StatusCodes } = require('http-status-codes');
const User = require('../../database/dao/user');
const { JWT_SECRET_KEY } = require('../../../common/config');
const ServerResponseError = require('./error/ServerResponseError');

const promisifiedJWTVerify = promisify(jwt.verify);

const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    // remove Bearer from string
    token = token.slice(7, token.length);

    const { login, userId } = await promisifiedJWTVerify(token, JWT_SECRET_KEY);
    const foundUser = await User.getEntityById(userId);

    if (foundUser && login === foundUser.login) return next();
  }
  throw new ServerResponseError(StatusCodes.UNAUTHORIZED);
};

module.exports = authenticateUser;
