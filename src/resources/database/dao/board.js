const mongoose = require('mongoose');
const Board = require('../models/Board');
const Task = require('../models/Task');

module.exports = {
  getAll() {
    return Board.find({}).exec();
  },

  getEntityById(id) {
    return Board.findById(id).exec();
  },

  createEntity(entity) {
    return Board.create(entity);
  },

  replaceEntity(id, entityData) {
    const options = {
      new: true,
      omitUndefined: true,
      returnOriginal: false
    };

    return Board.findOneAndReplace({ _id: id }, entityData, options).exec();
  },

  async deleteEntity(id) {
    const session = await mongoose.startSession();
    let deletedBoard;

    await session.withTransaction(async () => {
      deletedBoard = await Board.findOneAndDelete(id)
        .session(session)
        .exec();

      await Task.updateMany({ boardId: id }, { columnId: null, boardId: null })
        .session(session)
        .exec();
    });

    await session.endSession();

    return deletedBoard;
  }
};
