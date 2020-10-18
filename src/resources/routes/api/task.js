const router = require('express').Router();
const taskDAO = require('../../database/dao/task');
const boardDAO = require('../../database/dao/board');
const userDAO = require('../../database/dao/user');
const { METHODS } = require('../../../common/config');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');

router.param('boardId', async (req, res, next, boardId) => {
  taskDAO.board = await boardDAO.getEntityById(boardId);
  taskDAO.userDAO = userDAO;
  next();
});

router
  .route('/:boardId/tasks')
  .get(async (req, res) => {
    const tasks = await taskDAO.getAll();

    res.json(tasks);
  })
  .post(async (req, res, next) => {
    const task = req.body;

    try {
      const createdTask = await taskDAO.createEntity(task);
      res.json(createdTask);
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:boardId/tasks/:id')
  .get(createEntityByIdRouteMiddleware(METHODS.GET, taskDAO))
  .put(createEntityByIdRouteMiddleware(METHODS.PUT, taskDAO))
  .delete(createEntityByIdRouteMiddleware(METHODS.DELETE, taskDAO));

module.exports = router;
