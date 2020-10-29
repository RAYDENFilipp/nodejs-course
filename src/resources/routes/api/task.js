const router = require('express').Router();
const taskDAO = require('../../database/dao/task');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');
const createEntitiesRouteMiddleware = require('../middleware/createEntitiesRouteMiddleware');
const populateTaskDaoMiddleware = require('../middleware/populateTaskDaoMiddleware');

router.param('boardId', populateTaskDaoMiddleware);

router.route('/:boardId/tasks').all(createEntitiesRouteMiddleware(taskDAO));

router
  .route('/:boardId/tasks/:id')
  .all(createEntityByIdRouteMiddleware(taskDAO));

module.exports = router;
