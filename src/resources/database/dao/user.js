const User = require('../models/User');
const DAOBaseClass = require('./entity/DAOBaseClass');
const { USERS } = require('../db');
const taskDAO = require('./task');
const boardDAO = require('./board');

class UserDAO extends DAOBaseClass {
  constructor(entityType = USERS, entityCreator = User) {
    super(entityType, entityCreator);
    this.toResponse = this.entityCreator.toResponse;
  }

  async getAll() {
    const users = await super.getAll();

    return users && users.map(user => this.toResponse(user));
  }

  async getEntityById(id) {
    const user = await super.getEntityById(id);

    return user && this.toResponse(user);
  }

  async createEntity(entity) {
    const newEUser = await super.createEntity(entity);

    return newEUser && this.toResponse(newEUser);
  }

  async deleteEntity(id) {
    const deletedUser = await super.deleteEntity(id);

    if (deletedUser) {
      const boards = await boardDAO.getAll();

      for (const board of boards) {
        taskDAO.board = board;

        const tasks = await taskDAO.getAll();

        if (tasks) {
          for (const task of tasks) {
            await taskDAO.updateEntity(task.id, { ...task, userId: null });
          }
        }
      }
    }

    return deletedUser && this.toResponse(deletedUser);
  }
}

module.exports = new UserDAO();
