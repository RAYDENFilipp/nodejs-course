const { TASKS } = require('../db');
const Task = require('../models/Task');
const DAOBaseClass = require('./entity/DAOBaseClass');
const columnDAO = require('./column');

class TaskDAO extends DAOBaseClass {
  constructor(entityType = TASKS, entityCreator = Task) {
    super(entityType, entityCreator);
    this.board = null;
    this.userDAO = null;
  }

  async getAll() {
    const tasks = await super.getAll();

    const filteredTasks = tasks.filter(task => task.boardId === this.board.id);

    return filteredTasks.length === 0 ? undefined : filteredTasks;
  }

  async createEntity(task) {
    // if task has a columnId
    if (task.columnId) {
      const createdTask = await super.createEntity({
        ...task,
        boardId: this.board.id
      });

      // find a column to which the task should belong
      const columnToUpdate = await columnDAO.getEntityById(
        createdTask.columnId
      );

      // ...if such a column exist
      if (columnToUpdate) {
        await this._addTaskToColumn(columnToUpdate, createdTask);
      } else {
        // ...if not, create a new column by columnId

        await columnDAO.createEntity({
          id: createdTask.columnId,
          tasks: [createdTask.id]
        });
      }

      return createdTask;
    }

    return super.createEntity({
      ...task,
      boardId: this.board.id
    });
  }

  async _addTaskToColumn(columnToUpdate, createdTask) {
    const updatedTasks = columnToUpdate.tasks.push(createdTask.id);

    await columnDAO.updateEntity(columnToUpdate.id, {
      tasks: updatedTasks
    });
  }

  async updateEntity(id, entityData) {
    // take an old task and store it in memory by copying
    const oldTask = { ...(await super.getEntityById(id)) };
    //  update an existing task
    const updatedTask = await super.updateEntity(id, {
      ...entityData,
      boardId: this.board.id
    });

    if (updatedTask) {
      // now we have to check if an updated task has to move to another board
      await this._updateColumns(updatedTask, oldTask);
      // we have to add a new user if they have been added
      if (updatedTask.userId) await this._addNewUser(updatedTask.userId);
    }

    return updatedTask;
  }

  async _addNewUser(userId) {
    if (this.userDAO) {
      const existingUser = await this.userDAO.getEntityById(userId);

      if (!existingUser) {
        await this.userDAO.createEntity({ id: userId });
      }
    }
  }

  async _updateColumns(updatedTask, oldTask) {
    if (updatedTask.columnId) {
      const columnToUpdate = await columnDAO.getEntityById(
        updatedTask.columnId
      );

      // ...that already exists
      if (columnToUpdate) {
        // remove taskId from the old column and push to the other one, unless it is the same column
        if (
          columnToUpdate.tasks &&
          !columnToUpdate.tasks.includes(updatedTask.id)
        ) {
          await this._removeTaskFromPrevColumn(oldTask);

          await columnDAO.updateEntity(columnToUpdate.id, {
            tasks: [...columnToUpdate.tasks, updatedTask.id]
          });
        }
      } else {
        // ...or create a new column to push the task to, if not(updates a column array!)
        await this._removeTaskFromPrevColumn(oldTask);
        await columnDAO.createEntity({
          id: updatedTask.columnId,
          tasks: [updatedTask.id]
        });
      }
    } else {
      await this._removeTaskFromPrevColumn(oldTask);
    }
  }

  async _removeTaskFromPrevColumn(oldTask) {
    const oldColumn = await columnDAO.getEntityById(oldTask.columnId);

    if (oldColumn && oldColumn.tasks) {
      const newTasks = oldColumn.tasks.filter(taskId => taskId !== oldTask.id);

      await columnDAO.updateEntity(oldColumn.id, {
        tasks: newTasks
      });
    }
  }

  async deleteEntity(id) {
    const deletedTask = await super.deleteEntity(id);

    if (deletedTask) {
      await this._removeTaskFromPrevColumn(deletedTask);
    }

    return deletedTask;
  }
}

module.exports = new TaskDAO();
