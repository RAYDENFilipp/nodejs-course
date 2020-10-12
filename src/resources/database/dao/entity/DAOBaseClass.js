const DB = require('../../db');

// JS Abstract class implementation
class DAOBaseClass {
  constructor(entityType, entityCreator) {
    if (this.constructor === DAOBaseClass) {
      throw new TypeError('Abstract class must not be instantiated');
    }
    this.entityType = entityType;
    this.entityCreator = entityCreator;
  }

  getAll() {
    return DB.getAll(this.entityType);
  }

  getEntityById(id) {
    return DB.getEntityById(this.entityType, id);
  }

  createEntity(entity) {
    return DB.createEntity(this.entityType, new this.entityCreator(entity));
  }

  updateEntity(id, entityData) {
    return DB.updateEntity(this.entityType, id, entityData);
  }

  deleteEntity(id) {
    return DB.deleteEntity(this.entityType, id);
  }
}

module.exports = DAOBaseClass;
