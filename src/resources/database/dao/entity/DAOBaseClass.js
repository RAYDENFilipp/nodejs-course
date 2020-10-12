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

  getEntityById(req) {
    const { id } = req.params;
    return DB.getEntityById(this.entityType, id);
  }

  createEntity(req) {
    const entity = req.body;
    return DB.createEntity(this.entityType, new this.entityCreator(entity));
  }

  updateEntity(req) {
    const { id } = req.params;
    const entityData = req.body;
    return DB.updateEntity(this.entityType, id, entityData);
  }

  deleteEntity(req) {
    const { id } = req.params;
    return DB.deleteEntity(this.entityType, id);
  }
}

module.exports = DAOBaseClass;
