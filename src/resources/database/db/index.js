const User = require('../models/user');
const mockdata = require('mockdata');

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

const getAll = async entity => {
  return DB[entity];
};

const getEntityItemById = async (entity, id) => {
  return DB[entity].find(user => user.id === id);
};

const createEntityItem = async (entity, item) => {
  if (!item) throw new Error('invalid data');
  const newItem = new User({ ...item });
  return DB[entity].push(newItem) && newItem;
};

const updateEntityItem = async (entity, itemId, itemData) => {
  const itemToUpdate = DB[entity].find(item => item.id === itemId);

  for (const itemKey of Object.getOwnPropertyNames(itemData)) {
    // check if an existing object has a field to update
    if (itemToUpdate[itemKey]) itemToUpdate[itemKey] = itemData[itemKey];
    else throw new Error('invalid data');
  }

  return itemToUpdate;
};

const deleteEntityItem = async (entity, id) => {
  const deleteItem = DB[entity].find((item, idx, thisEntityDB) => {
    const idsAreEqual = item.id === id;

    if (idsAreEqual) thisEntityDB.splice(idx, 1);

    return idsAreEqual;
  });

  if (!deleteItem) throw new Error('invalid data');

  return deleteItem;
};

module.exports = {
  getAll,
  getEntityItemById,
  createEntityItem,
  deleteEntityItem,
  updateEntityItem
};
