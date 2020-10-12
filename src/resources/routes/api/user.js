const router = require('express').Router();
const userDAO = require('../../database/dao/user');
const { METHODS } = require('../../../common/config');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');

router
  .route('/')
  .get(async (req, res) => {
    const users = await userDAO.getAll();
    // map user fields to exclude secret fields like "password"
    res.json(users);
  })
  .post(async (req, res, next) => {
    try {
      const createdUser = await userDAO.createEntity(req.body);
      res.json(createdUser);
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:id')
  .get(createEntityByIdRouteMiddleware(METHODS.GET, userDAO))
  .put(createEntityByIdRouteMiddleware(METHODS.PUT, userDAO))
  .delete(createEntityByIdRouteMiddleware(METHODS.DELETE, userDAO));

module.exports = router;
