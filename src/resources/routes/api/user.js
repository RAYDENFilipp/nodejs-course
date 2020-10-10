const router = require('express').Router();
const usersService = require('../../database/dao/user');
const { METHODS } = require('../../../common/config');
const createUserByIdRouteMiddleware = require('../middleware/createUserIdRouteMiddleware');

router
  .route('/')
  .get(async (req, res) => {
    const users = await usersService.getAll();
    // map user fields to exclude secret fields like "password"
    res.json(users);
  })
  .post(async (req, res) => {
    const user = req.body;

    const createdUser = await usersService.createUser(user);

    res.json(createdUser);
  });

router
  .route('/:id')
  .get(createUserByIdRouteMiddleware(METHODS.GET))
  .put(createUserByIdRouteMiddleware(METHODS.PUT))
  .delete(createUserByIdRouteMiddleware(METHODS.DELETE));

module.exports = router;
