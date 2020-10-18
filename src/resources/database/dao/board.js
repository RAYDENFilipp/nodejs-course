const Board = require('../models/Board');
const DAOBaseClass = require('./entity/DAOBaseClass');
const { BOARDS } = require('../db');

class BoardDAO extends DAOBaseClass {
  constructor(entityType = BOARDS, entityCreator = Board) {
    super(entityType, entityCreator);
    this.taskDAO = null;
    this.columnDAO = null;
  }

  async createEntity(entity) {
    const { columns } = entity;

    if (columns) {
      const producedColumns = await this._produceColumns(columns);

      if (producedColumns) {
        return super.createEntity({ ...entity, columns: producedColumns });
      }
    }

    return super.createEntity(entity);
  }

  async _produceColumns(columns) {
    const columnDAO = this.columnDAO;
    if (columnDAO) {
      return Promise.all(columns.map(column => columnDAO.createEntity(column)));
    }
  }

  async deleteEntity(id) {
    const deletedBoard = await super.deleteEntity(id);

    if (deletedBoard) {
      await this._deleteRelatedTasks(deletedBoard);
      await this._deleteRelatedColumns(deletedBoard);
    }

    return deletedBoard;
  }

  async _deleteRelatedColumns(deletedBoard) {
    const columnDAO = this.columnDAO;

    if (columnDAO) {
      const columns = deletedBoard.columns;

      await Promise.all(
        columns.map(column => columnDAO.deleteEntity(column.id))
      );
    }
  }

  async _deleteRelatedTasks(deletedBoard) {
    const taskDAO = this.taskDAO;

    if (taskDAO) {
      taskDAO.board = deletedBoard;

      const allTasks = await taskDAO.getAll();

      if (allTasks) {
        await Promise.all(
          allTasks.map(task => {
            if (task.boardId === deletedBoard.id) {
              taskDAO.deleteEntity(task.id);
            }
          })
        );
      }
    }
  }
}

module.exports = new BoardDAO();
