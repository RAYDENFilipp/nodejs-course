const { StatusCodes } = require('http-status-codes');

const router = require('express').Router();
const taskDAO = require('../../database/dao/task');
const boardDAO = require('../../database/dao/board');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');
const createEntitiesRouteMiddleware = require('../middleware/createEntitiesRouteMiddleware');

router.param('boardId', async (req, res, next, boardId) => {
  const foundBoard = await boardDAO.getEntityById(boardId);
  if (!foundBoard) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return next('route');
  }
  taskDAO.setBoard(foundBoard);

  next();
});

router.route('/:boardId/tasks').all(createEntitiesRouteMiddleware(taskDAO));

router
  .route('/:boardId/tasks/:id')
  .all(createEntityByIdRouteMiddleware(taskDAO));

module.exports = router;
