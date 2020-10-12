const { TASKS } = require('../db');
const Task = require('../models/Task');
const DAOBaseClass = require('./entity/DAOBaseClass');
const boardDAO = require('../../database/dao/board');
const columnDAO = require('../../database/dao/column');

class TaskDAO extends DAOBaseClass {
  constructor(entityType = TASKS, entityCreator = Task) {
    super(entityType, entityCreator);
    this.board = '';
  }

  async storedBoard(id) {
    this.board = await boardDAO.getEntityById(id);
  }

  async getAll() {
    const tasks = await super.getAll();
    const taskIds =
      this.board && this.board.columns.flatMap(column => column.tasks);

    const filteredTasks =
      taskIds.length && tasks.filter(task => taskIds.includes(task.id));
    return filteredTasks.length === 0 ? undefined : filteredTasks;
  }

  async createEntity(task) {
    const createdTask = await super.createEntity({
      ...task,
      boardId: this.board.id
    });
    const columnToUpdate =
      this.board &&
      this.board.columns.find(column => column.id === createdTask.columnId);

    if (columnToUpdate) {
      columnToUpdate.push(createdTask.id);

      return createdTask;
    }

    const newColumn = await columnDAO.createEntity({ tasks: [createdTask.id] });
    await this.board.columns.push(newColumn);

    return createdTask;
  }

  async updateEntity(id, entityData) {
    const oldTask = { ...(await super.getEntityById(id)) };
    const updatedTask = super.updateEntity(id, {
      ...entityData,
      boardId: this.board.id
    });

    if (updatedTask) {
      const columns = this.board && this.board.columns;

      const columnToUpdate = columns.find(
        column => column.id === updatedTask.columnId
      );

      if (columnToUpdate) {
        // remove taskId from the old column and push to the other one
        if (
          columnToUpdate.tasks &&
          !columnToUpdate.tasks.includes(updatedTask.id)
        ) {
          const oldColumn = await columnDAO.getEntityById(oldTask.columnId);
          oldColumn.tasks.find((taskId, idx, currentColumn) => {
            if (taskId === oldTask.id) {
              currentColumn.splice(idx, 1);
            }

            return taskId === oldTask.id;
          });
          columnToUpdate.tasks.push(updatedTask.id);
        }
      } else {
        // or create a new column to push the task to
        const newColumn = await columnDAO.createEntity({
          tasks: [updatedTask.id]
        });
        await this.board.columns.push(newColumn);
      }
    }

    return updatedTask;
  }

  async deleteEntity(id) {
    const deletedTask = await super.deleteEntity(id);

    if (deletedTask) {
      console.log(deletedTask);
      // delete the task from it's column
      const oldColumn = await columnDAO.getEntityById(deletedTask.columnId);
      console.log(oldColumn);
      if (oldColumn) {
        // remove deleted tasks from column
        const newTasks =
          oldColumn.tasks &&
          oldColumn.tasks.filter(taskId => taskId !== deletedTask.id);
        await columnDAO.updateEntity(oldColumn.id, {
          ...oldColumn,
          tasks: newTasks
        });
      }
    }

    return deletedTask;
  }
}

module.exports = new TaskDAO();
