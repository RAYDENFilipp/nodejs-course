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
    return filteredTasks.length === 0 ? tasks : filteredTasks;
  }

  async createEntity(task) {
    const columnToUpdate =
      this.board &&
      this.board.columns.find(column => column.id === task.columnId);

    if (columnToUpdate) {
      columnToUpdate.push(task.id);

      return task;
    }

    const newColumn = await columnDAO.createEntity({ tasks: [task.id] });
    await this.board.columns.push(newColumn);

    return task;
  }

  async updateEntity(id, entityData) {
    const oldTask = { ...(await super.getEntityById(id)) };
    const updatedTask = super.updateEntity(id, entityData);

    if (updatedTask) {
      const columns = this.board && this.board.columns;

      const columnToUpdate = columns.find(
        column => column.id === updatedTask.columnId
      );

      if (columnToUpdate) {
        // remove taskId from the old column and push to the other one
        if (!columnToUpdate.tasks.includes(updatedTask.id)) {
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
      // delete the task from it's column
      const oldColumn = await columnDAO.getEntityById(deletedTask.columnId);
      // remove deleted tasks from column
      const newTasks = oldColumn.tasks.filter(
        taskId => taskId !== deletedTask.id
      );
      await columnDAO.updateEntity({ ...oldColumn, tasks: newTasks });
      /*      const columns = this.board && this.board.columns;
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const success = column.find((task, idx, currentColumn) => {
          if (task.id === deletedTask.id) {
            currentColumn.splice(idx, 1);
          }

          return task.id === deletedTask.id;
        });

        if (success) break;
      }*/
    }

    return deletedTask;
  }
}

module.exports = new TaskDAO();
