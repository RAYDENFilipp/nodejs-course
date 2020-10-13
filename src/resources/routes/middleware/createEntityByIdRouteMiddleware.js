const { METHODS } = require('../../../common/config');

const createUserByIdRouteMiddleware = (action, dao) => async (
  req,
  res,
  next
) => {
  const {
    params: { id },
    body
  } = req;
  let entityToReturn;

  try {
    switch (action) {
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
    else res.sendStatus('404');
  } catch (err) {
    // eslint-disable-next-line callback-return
    next(err);
  }
};

module.exports = createUserByIdRouteMiddleware;
