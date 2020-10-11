const router = require('express').Router();
const boardsService = require('../../database/dao/board');
const { METHODS } = require('../../../common/config');
const createEntityByIdRouteMiddleware = require('../middleware/createEntityByIdRouteMiddleware');

router
  .route('/')
  .get(async (req, res) => {
    const boards = await boardsService.getAll();
    // map user fields to exclude secret fields like "password"
    res.json(boards);
  })
  .post(async (req, res) => {
    const board = req.body;

    const createdBoard = await boardsService.createEntity(board);

    res.json(createdBoard);
  });

router
  .route('/:id')
  .get(createEntityByIdRouteMiddleware(METHODS.GET, boardsService))
  .put(createEntityByIdRouteMiddleware(METHODS.PUT, boardsService))
  .delete(createEntityByIdRouteMiddleware(METHODS.DELETE, boardsService));

module.exports = router;
