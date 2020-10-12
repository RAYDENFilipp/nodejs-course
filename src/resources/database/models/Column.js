const uuid = require('uuid');

// to mock a mongo-schema model
class Column {
  constructor({
    id = uuid(),
    title = 'COLUMN TITLE',
    order = 0,
    tasks = []
  } = {}) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.tasks = tasks;
  }
}

module.exports = Column;
