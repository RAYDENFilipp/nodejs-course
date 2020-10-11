const mockdata = require('mockdata');
const User = require('../models/User');
const Board = require('../models/Board');

const DB = {
  BOARDS: [],
  TASKS: [],
  COLUMNS: [],
  USERS: []
};

// init Users
for (let i = 0; i < 10; i++) {
  DB.USERS[i] = new User({
    name: mockdata.name(),
    login: `${mockdata.name()}${mockdata.chars(1, 5)}`,
    password: `${mockdata.chars(5, 10)}`
  });
}

// init Boards
for (let i = 0; i < 3; i++) {
  DB.BOARDS[i] = new Board({
    title: mockdata.title(5, 8),
    columns: []
  });
}

const getAll = async entityName => {
  return DB[entityName];
};

const getEntityById = async (entityName, id) => {
  return DB[entityName].find(entity => entity.id === id);
};

const createEntity = async (entityName, entity) => {
  if (!entity) throw new Error('invalid data');
  return DB[entityName].push(entity) && entity;
};

const updateEntity = async (entityName, entityId, entityData) => {
  const entityToUpdate = DB[entityName].find(entity => entity.id === entityId);

  if (entityToUpdate) {
    for (const entityKey of Object.getOwnPropertyNames(entityData)) {
      // check if an existing object has a field to update
      if (entityToUpdate[entityKey]) {
        entityToUpdate[entityKey] = entityData[entityKey];
      } else throw new Error('invalid data');
    }
  }

  return entityToUpdate;
};

const deleteEntity = async (entityName, id) => {
  return DB[entityName].find((entity, idx, thisEntityCollection) => {
    const idsAreEqual = entity.id === id;

    if (idsAreEqual) thisEntityCollection.splice(idx, 1);

    return idsAreEqual;
  });
};

module.exports = {
  getAll,
  getEntityById,
  createEntity,
  deleteEntity,
  updateEntity
};
