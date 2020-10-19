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
        res.end();
    }

    if (entityToReturn) res.json(entityToReturn);
    else res.sendStatus('404');
  } catch (err) {
    // eslint-disable-next-line callback-return
    next(err);
  }
};

module.exports = createEntitiesRouteMiddleware;
