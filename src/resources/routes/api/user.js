const router = require('express').Router();
const userDAO = require('../../database/dao/user');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');
const createEntitiesRouteMiddleware = require('../middleware/createEntitiesRouteMiddleware');

router.route('/').all(createEntitiesRouteMiddleware(userDAO));

router.route('/:id').all(createEntityByIdRouteMiddleware(userDAO));

module.exports = router;
