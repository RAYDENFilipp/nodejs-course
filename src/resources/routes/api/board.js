const router = require('express').Router();
const boardDAO = require('../../database/dao/board');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');
const createEntitiesRouteMiddleware = require('../middleware/createEntitiesRouteMiddleware');

router.route('/').all(createEntitiesRouteMiddleware(boardDAO));

router.route('/:id').all(createEntityByIdRouteMiddleware(boardDAO));

module.exports = router;
