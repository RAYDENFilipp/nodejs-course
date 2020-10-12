const uuid = require('uuid');

// to mock a mongo-schema model
class Task {
  constructor({
    id = uuid(),
    title = 'TASK TITLE',
    order = 0,
    description = 'description',
    userId = null,
    columnId = null,
    boardId = null
  } = {}) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.description = description;
    this.userId = userId;
    this.columnId = columnId;
    this.boardId = boardId;
  }
}

module.exports = Task;
