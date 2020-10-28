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

  async createEntity(entity) {
    return Board.create(entity);
  },

  async replaceEntity(id, entityData) {
    const options = {
      new: true,
      omitUndefined: true
    };

    return Board.findOneAndReplace({ _id: id }, entityData, options).exec();
  },

  async deleteEntity(id) {
    const session = await mongoose.startSession();
    let deletedBoard;

    await session.withTransaction(async () => {
      deletedBoard = await Board.findByIdAndDelete(id)
        .session(session)
        .exec();

      await Task.deleteMany({ boardId: id })
        .session(session)
        .exec();
    });

    await session.endSession();

    return deletedBoard;
  }
};
