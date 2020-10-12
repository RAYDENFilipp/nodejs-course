const { COLUMNS } = require('../db');
const Column = require('../models/Column');
const DAOBaseClass = require('./entity/DAOBaseClass');

class ColumnDAO extends DAOBaseClass {
  constructor(entityType = COLUMNS, entityCreator = Column) {
    super(entityType, entityCreator);
  }
}

module.exports = new ColumnDAO();
