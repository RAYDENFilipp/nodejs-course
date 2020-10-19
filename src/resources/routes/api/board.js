const router = require('express').Router();
const boardDAO = require('../../database/dao/board');
const columnDAO = require('../../database/dao/column');
const taskDAO = require('../../database/dao/task');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');
const createEntitiesRouteMiddleware = require('../middleware/createEntitiesRouteMiddleware');

router.use((req, res, next) => {
  boardDAO.taskDAO = taskDAO;
  boardDAO.columnDAO = columnDAO;
  next();
});

router.route('/').all(createEntitiesRouteMiddleware(boardDAO));

router.route('/:id').all(createEntityByIdRouteMiddleware(boardDAO));

module.exports = router;
