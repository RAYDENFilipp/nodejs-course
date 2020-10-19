const router = require('express').Router();
const taskDAO = require('../../database/dao/task');
const boardDAO = require('../../database/dao/board');
const userDAO = require('../../database/dao/user');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');
const createEntitiesRouteMiddleware = require('../middleware/createEntitiesRouteMiddleware');

router.param('boardId', async (req, res, next, boardId) => {
  taskDAO.board = await boardDAO.getEntityById(boardId);
  taskDAO.userDAO = userDAO;
  next();
});

router.route('/:boardId/tasks').all(createEntitiesRouteMiddleware(taskDAO));

router
  .route('/:boardId/tasks/:id')
  .all(createEntityByIdRouteMiddleware(taskDAO));

module.exports = router;
