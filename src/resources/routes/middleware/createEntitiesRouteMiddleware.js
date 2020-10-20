const { StatusCodes } = require('http-status-codes');
const { METHODS } = require('../../../common/config');

const createEntitiesRouteMiddleware = dao => async (req, res, next) => {
  let entityToReturn;

  try {
    switch (req.method) {
      case METHODS.GET:
        entityToReturn = await dao.getAll();
        break;
      case METHODS.POST:
        entityToReturn = await dao.createEntity(req.body);
        break;
      default:
        res.sendStatus(StatusCodes.NOT_IMPLEMENTED);
    }

    if (entityToReturn) res.json(entityToReturn);
    else res.sendStatus(StatusCodes.NOT_FOUND);
  } catch (err) {
    return next(err);
  }
};

module.exports = createEntitiesRouteMiddleware;
