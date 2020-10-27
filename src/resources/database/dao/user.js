const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

module.exports = {
  getAll() {
    return User.find({})
      .lean()
      .exec();
  },

  getEntityById(id) {
    return User.findById(id)
      .lean()
      .exec();
  },

  createEntity(entity) {
    return User.create(entity);
  },

  replaceEntity(id, entityData) {
    const options = {
      new: true,
      omitUndefined: true
    };

    return User.findOneAndReplace({ _id: id }, entityData, options)
      .lean()
      .exec();
  },

  async deleteEntity(id) {
    const session = await mongoose.startSession();
    let deletedUser;

    await session.withTransaction(async () => {
      deletedUser = await User.findOneAndDelete(id)
        .session(session)
        .lean()
        .exec();

      await Task.updateMany({ userId: id }, { userId: null })
        .session(session)
        .lean()
        .exec();
    });

    await session.endSession();

    return deletedUser;
  }
};
