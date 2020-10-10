const DB = require('../db');
const User = require('../models/user');
const USERS = 'USERS';

const getAll = async () =>
  (await DB.getAll(USERS)).map(user => User.toResponse(user));
const getUserById = async id => {
  const user = await DB.getEntityItemById(USERS, id);
  return User.toResponse(user);
};
const createUser = async user => {
  const createdUser = await DB.createEntityItem(USERS, user);
  return User.toResponse(createdUser);
};
const updateUser = async (userId, userData) => {
  const updatedUser = await DB.updateEntityItem(USERS, userId, userData);
  return User.toResponse(updatedUser);
};
const deleteUser = async id => {
  const deletedUser = await DB.deleteEntityItem(USERS, id);
  return User.toResponse(deletedUser);
};

module.exports = { getAll, getUserById, createUser, deleteUser, updateUser };
