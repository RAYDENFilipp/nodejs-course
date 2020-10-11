const DB = require('../db');
const User = require('../models/User');
const USERS = 'USERS';

const getAll = async () =>
  (await DB.getAll(USERS)).map(user => User.toResponse(user));
const getEntityById = async id => {
  const user = await DB.getEntityById(USERS, id);
  return user && User.toResponse(user);
};
const createEntity = async user => {
  const createdUser = await DB.createEntity(USERS, new User(user));
  return createdUser && User.toResponse(createdUser);
};
const updateEntity = async (userId, userData) => {
  const updatedUser = await DB.updateEntity(USERS, userId, userData);
  return updatedUser && User.toResponse(updatedUser);
};
const deleteEntity = async id => {
  const deletedUser = await DB.deleteEntity(USERS, id);
  return deletedUser && User.toResponse(deletedUser);
};

module.exports = {
  getAll,
  getEntityById,
  createEntity,
  deleteEntity,
  updateEntity
};
