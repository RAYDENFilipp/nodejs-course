const ServerResponseError = require('./error/ServerResponseError');
const { StatusCodes } = require('http-status-codes');
const { METHODS } = require('../../../common/config');

const createEntityByIdRouteMiddleware = dao => async (req, res) => {
  const {
    params: { id },
    body,
    method
  } = req;
  let entityToReturn;

  switch (method) {
    case METHODS.GET:
      entityToReturn = await dao.getEntityById(id);
      break;
    case METHODS.PUT:
      entityToReturn = await dao.replaceEntity(id, body);
      break;
    case METHODS.DELETE:
      entityToReturn = await dao.deleteEntity(id);
      break;
    default:
      throw new ServerResponseError(StatusCodes.NOT_IMPLEMENTED);
  }

  if (entityToReturn) {
    if (method === METHODS.DELETE) res.sendStatus(StatusCodes.NO_CONTENT);
    else res.json(entityToReturn);
  } else throw new ServerResponseError(StatusCodes.NOT_FOUND);
};

module.exports = createEntityByIdRouteMiddleware;
