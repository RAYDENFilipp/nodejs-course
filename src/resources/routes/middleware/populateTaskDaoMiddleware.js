const { StatusCodes } = require('http-status-codes');
const boardDAO = require('../../database/dao/board');
const taskDAO = require('../../database/dao/task');
const ServerResponseError = require('./error/ServerResponseError');

const populateTaskDaoMiddleware = async (req, res, next, boardId) => {
  const foundBoard = await boardDAO.getEntityById(boardId);

  if (!foundBoard) {
    throw new ServerResponseError(StatusCodes.NOT_FOUND);
  }
  taskDAO.setBoard(foundBoard);

  return next();
};

module.exports = populateTaskDaoMiddleware;
