const { StatusCodes } = require('http-status-codes');
const { METHODS } = require('../../../common/config');

const createEntityByIdRouteMiddleware = dao => async (req, res, next) => {
  const {
    params: { id },
    body,
    method
  } = req;
  let entityToReturn;

  try {
    switch (method) {
      case METHODS.GET:
        entityToReturn = await dao.getEntityById(id);
        break;
      case METHODS.PUT:
        entityToReturn = await dao.updateEntity(id, body);
        break;
      case METHODS.DELETE:
        entityToReturn = await dao.deleteEntity(id);
        break;
      default:
        res.end();
    }

    if (entityToReturn) res.json(entityToReturn);
    else res.sendStatus(StatusCodes.NOT_FOUND);
  } catch (err) {
    // eslint-disable-next-line callback-return
    next(err);
  }
};

module.exports = createEntityByIdRouteMiddleware;
