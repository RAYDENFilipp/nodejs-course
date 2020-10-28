const mongoose = require('mongoose');
const Board = require('../models/Board');
const Task = require('../models/Task');

module.exports = {
  getAll() {
    return Board.find({})
      .lean()
      .exec();
  },

  getEntityById(id) {
    return Board.findById(id)
      .lean()
      .exec();
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

    return Board.findOneAndReplace({ _id: id }, entityData, options)
      .lean()
      .exec();
  },

  async deleteEntity(id) {
    const session = await mongoose.startSession();
    let deletedBoard;

    await session.withTransaction(async () => {
      deletedBoard = await Board.findOneAndDelete(id)
        .session(session)
        .lean()
        .exec();

      await Task.updateMany({ boardId: id }, { columnId: null, boardId: null })
        .session(session)
        .exec();
    });

    await session.endSession();

    return deletedBoard;
  }
};
