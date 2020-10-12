const router = require('express').Router();
const boardDAO = require('../../database/dao/board');
const { METHODS } = require('../../../common/config');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');

router
  .route('/')
  .get(async (req, res) => {
    const boards = await boardDAO.getAll();

    res.json(boards);
  })
  .post(async (req, res) => {
    const createdBoard = await boardDAO.createEntity(req.body);

    res.json(createdBoard);
  });

router
  .route('/:id')
  .get(createEntityByIdRouteMiddleware(METHODS.GET, boardDAO))
  .put(createEntityByIdRouteMiddleware(METHODS.PUT, boardDAO))
  .delete(createEntityByIdRouteMiddleware(METHODS.DELETE, boardDAO));

module.exports = router;
