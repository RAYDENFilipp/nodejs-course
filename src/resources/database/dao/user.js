const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

module.exports = {
  getAll() {
    return User.find({}).exec();
  },

  getEntityById(id) {
    return User.findById(id).exec();
  },

  async createEntity(entity) {
    await User.init();
    return User.create(entity);
  },

  replaceEntity(id, entityData) {
    const options = {
      new: true,
      omitUndefined: true
    };

    return User.findOneAndReplace({ _id: id }, entityData, options).exec();
  },

  async deleteEntity(id) {
    const session = await mongoose.startSession();
    let deletedUser;

    await session.withTransaction(async () => {
      deletedUser = await User.findByIdAndDelete(id)
        .session(session)
        .exec();

      await Task.updateMany({ userId: id }, { userId: null })
        .session(session)
        .exec();
    });

    await session.endSession();

    return deletedUser;
  }
};
