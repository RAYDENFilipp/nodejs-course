const User = require('../models/User');
const DAOBaseClass = require('./entity/DAOBaseClass');

class UserDAO extends DAOBaseClass {
  constructor(entityType = 'USERS', entityCreator = User) {
    super(entityType, entityCreator);
    this.toResponse = this.entityCreator.toResponse;
  }

  async getAll() {
    const users = await super.getAll();

    return users && users.map(user => this.toResponse(user));
  }

  async getEntityById(req) {
    const user = await super.getEntityById(req);

    return user && this.toResponse(user);
  }

  async createEntity(req) {
    const newEUser = await super.createEntity(req);

    return newEUser && this.toResponse(newEUser);
  }

  async deleteEntity(req) {
    const deletedUser = await super.deleteEntity(req);

    return deletedUser && this.toResponse(deletedUser);
  }
}

module.exports = new UserDAO();
