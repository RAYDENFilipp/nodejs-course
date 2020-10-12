const Board = require('../models/Board');
const DAOBaseClass = require('./entity/DAOBaseClass');

class BoardDAO extends DAOBaseClass {
  constructor(entityType = 'BOARDS', entityCreator = Board) {
    super(entityType, entityCreator);
  }
}

module.exports = new BoardDAO();
