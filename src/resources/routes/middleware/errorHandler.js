const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { logger } = require('../../../common/logger');

function errorHandler(err, req, res) {
  const isMongoError = err instanceof mongoose.Error;
  const isJWTTokenExpiredError = err instanceof jwt.TokenExpiredError;

  if (isMongoError) {
    let message;
    res.status(StatusCodes.BAD_REQUEST);

    if (err instanceof mongoose.Error.CastError) {
      message = err.reason.message;
    } else if (err instanceof mongoose.Error.ValidationError) {
      message = err.message;
    }

    res.send({ message });
  } else if (isJWTTokenExpiredError) {
    res.status(StatusCodes.FORBIDDEN).send({ message: 'Token has expired' });
  } else {
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;

    if (status >= 500) logger.error(err.stack);

    res.status(status).send({ message: err.message });
  }
}

module.exports = errorHandler;
