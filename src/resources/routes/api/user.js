const router = require('express').Router();
const usersService = require('../../database/dao/user');
const { METHODS } = require('../../../common/config');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');

router
  .route('/')
  .get(async (req, res) => {
    const users = await usersService.getAll();
    // map user fields to exclude secret fields like "password"
    res.json(users);
  })
  .post(async (req, res, next) => {
    try {
      const createdUser = await usersService.createEntity(req);
      res.json(createdUser);
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:id')
  .get(createEntityByIdRouteMiddleware(METHODS.GET, usersService))
  .put(createEntityByIdRouteMiddleware(METHODS.PUT, usersService))
  .delete(createEntityByIdRouteMiddleware(METHODS.DELETE, usersService));

module.exports = router;
