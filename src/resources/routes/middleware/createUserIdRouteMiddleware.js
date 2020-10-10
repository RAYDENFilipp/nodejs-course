const { METHODS } = require('../../../common/config');
const usersService = require('../../database/dao/user');

const createUserByIdRouteMiddleware = action => async (req, res) => {
  const { id } = req.params;
  let userToReturn;

  switch (action) {
    case METHODS.GET:
      userToReturn = await usersService.getUserById(id);
      break;
    case METHODS.PUT:
      userToReturn = await usersService.updateUser(id, req.body);
      break;
    case METHODS.DELETE:
      userToReturn = await usersService.deleteUser(id);
      break;
    default:
      res.end();
  }

  res.json(userToReturn);
};

module.exports = createUserByIdRouteMiddleware;
