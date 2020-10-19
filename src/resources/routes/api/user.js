const router = require('express').Router();
const userDAO = require('../../database/dao/user');
const taskDAO = require('../../database/dao/task');
const boardDAO = require('../../database/dao/board');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');
const createEntitiesRouteMiddleware = require('../middleware/createEntitiesRouteMiddleware');

router.use((req, res, next) => {
  userDAO.taskDAO = taskDAO;
  userDAO.boardDAO = boardDAO;
  next();
});

router.route('/').all(createEntitiesRouteMiddleware(userDAO));

router.route('/:id').all(createEntityByIdRouteMiddleware(userDAO));

module.exports = router;
