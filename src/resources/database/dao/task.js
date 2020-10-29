const Task = require('../models/Task');

let board;

const isValidColumn = entityWithBoardId => {
  // filter out a Task with an invalid columnId
  if (!entityWithBoardId.columnId) return !entityWithBoardId.columnId;

  return board.columns.find(
    column => column._id.toString() === entityWithBoardId.columnId
  );
};

module.exports = {
  setBoard(boardDoc) {
    board = boardDoc;
  },

  getAll() {
    return Task.find({ boardId: board._id }).exec();
  },

  getEntityById(id) {
    return Task.findById(id).exec();
  },

  createEntity(entity) {
    const entityWithBoardId = {
      ...entity,
      boardId: board._id
    };

    if (isValidColumn(entityWithBoardId)) {
      return Task.create(entityWithBoardId);
    }
  },

  replaceEntity(id, entityData) {
    const entityWithBoardId = {
      ...entityData,
      boardId: board._id
    };

    if (isValidColumn(entityWithBoardId)) {
      const options = {
        new: true,
        omitUndefined: true,
        returnOriginal: false
      };

      return Task.findOneAndReplace(
        { _id: id },
        entityWithBoardId,
        options
      ).exec();
    }
  },

  async deleteEntity(id) {
    return Task.findByIdAndDelete(id).exec();
  }
};
