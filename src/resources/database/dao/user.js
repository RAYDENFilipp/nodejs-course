const User = require('../models/User');
const DAOBaseClass = require('./entity/DAOBaseClass');
const { USERS } = require('../db');

class UserDAO extends DAOBaseClass {
  constructor(entityType = USERS, entityCreator = User) {
    super(entityType, entityCreator);
    this.toResponse = this.entityCreator.toResponse;
    this.boardDAO = null;
    this.taskDAO = null;
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
      await this._removeUsersFromTasks();
    }

    return deletedUser && this.toResponse(deletedUser);
  }

  async _removeUsersFromTasks() {
    const boardDAO = this.boardDAO;
    if (boardDAO) {
      const boards = await boardDAO.getAll();
      const taskDAO = this.taskDAO;

      if (taskDAO) {
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
    }
  }
}

module.exports = new UserDAO();
