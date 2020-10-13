const Board = require('../models/Board');
const DAOBaseClass = require('./entity/DAOBaseClass');
const { BOARDS } = require('../db');
const columnDAO = require('./column');
const taskDAO = require('./task');

class BoardDAO extends DAOBaseClass {
  constructor(entityType = BOARDS, entityCreator = Board) {
    super(entityType, entityCreator);
  }

  async createEntity(entity) {
    const { columns } = entity;

    if (columns) {
      for (let i = 0; i < columns.length; i++) {
        const existing = await columnDAO.getEntityById(columns[i].id);
        if (!existing) await columnDAO.createEntity(columns[i]);
        else await columnDAO.updateEntity(columns[i].id, columns[i]);
      }
    }

    return super.createEntity(entity);
  }

  async deleteEntity(id) {
    const deletedBoard = await super.deleteEntity(id);

    if (deletedBoard) {
      taskDAO.board = deletedBoard;

      const allTasks = await taskDAO.getAll();

      if (allTasks) {
        await Promise.all(
          allTasks.map(task => {
            if (task.boardId === deletedBoard.id) taskDAO.deleteEntity(task.id);
          })
        );
      }
    }

    return deletedBoard;
  }
}

module.exports = new BoardDAO();
