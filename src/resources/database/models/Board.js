const uuid = require('uuid');

class Board {
  constructor({ id = uuid(), title = 'BOARD TITLE', columns = [] } = {}) {
    this.id = id;
    this.title = title;
    this.columns = columns;
  }
}

module.exports = Board;
