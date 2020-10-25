const Task = require('../models/Task');

let board;

const validateColumn = entityWithBoardId => {
  // filter out a Task with an invalid columnId
  if (
    entityWithBoardId.columnId &&
    !board.columns.find(
      column => column._id.toString() === entityWithBoardId.columnId
    )
  ) {
    throw new Error('not valid');
  }
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

    validateColumn(entityWithBoardId);

    return Task.create(entityWithBoardId);
  },

  replaceEntity(id, entityData) {
    const entityWithBoardId = {
      ...entityData,
      boardId: board._id
    };

    validateColumn(entityWithBoardId);

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
  },

  async deleteEntity(id) {
    return Task.findByIdAndDelete(id).exec();
  }
};
