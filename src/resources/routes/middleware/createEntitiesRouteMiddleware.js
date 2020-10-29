const ServerResponseError = require('./error/ServerResponseError');
const { StatusCodes } = require('http-status-codes');
const { METHODS } = require('../../../common/config');

const createEntitiesRouteMiddleware = dao => async (req, res) => {
  let entityToReturn;

  switch (req.method) {
    case METHODS.GET:
      entityToReturn = await dao.getAll();
      break;
    case METHODS.POST:
      entityToReturn = await dao.createEntity(req.body);
      break;
    default:
      throw new ServerResponseError(StatusCodes.NOT_IMPLEMENTED);
  }

  if (entityToReturn) {
    res.json(entityToReturn);
  } else {
    throw new ServerResponseError(StatusCodes.NOT_FOUND);
  }
};

module.exports = createEntitiesRouteMiddleware;
