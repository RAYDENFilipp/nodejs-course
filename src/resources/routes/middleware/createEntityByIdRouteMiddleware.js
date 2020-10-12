const { METHODS } = require('../../../common/config');

const createUserByIdRouteMiddleware = (action, dao) => async (
  req,
  res,
  next
) => {
  let entityToReturn;

  try {
    switch (action) {
      case METHODS.GET:
        entityToReturn = await dao.getEntityById(req);
        break;
      case METHODS.PUT:
        entityToReturn = await dao.updateEntity(req);
        break;
      case METHODS.DELETE:
        entityToReturn = await dao.deleteEntity(req);
        break;
      default:
        res.end();
    }

    if (entityToReturn) res.json(entityToReturn);
    else res.sendStatus('404');
  } catch (err) {
    // eslint-disable-next-line callback-return
    next(err);
  }
};

module.exports = createUserByIdRouteMiddleware;
