const DB = require('../db');
const Board = require('../models/Board');
const BOARDS = 'BOARDS';

const getAll = async () => (await DB.getAll(BOARDS)).map(board => board);
const getEntityById = id => DB.getEntityById(BOARDS, id);
const createEntity = board => DB.createEntity(BOARDS, new Board(board));
const updateEntity = (boardId, boardData) =>
  DB.updateEntity(BOARDS, boardId, boardData);
const deleteEntity = id => DB.deleteEntity(BOARDS, id);

module.exports = {
  getAll,
  getEntityById,
  createEntity,
  deleteEntity,
  updateEntity
};
