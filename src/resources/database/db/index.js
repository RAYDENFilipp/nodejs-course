const mockdata = require('mockdata');
const User = require('../models/User');
const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');

const TASKS = 'TASKS';
const BOARDS = 'BOARDS';
const USERS = 'USERS';
const COLUMNS = 'COLUMNS';
const COLUMN_NAMES = ['Unassigned', 'In Progress', 'Done'];

const DB = {
  BOARDS: [],
  TASKS: [],
  COLUMNS: [],
  USERS: []
};

// INITIALIZATION STEP
function initDB() {
  const randomIndex = indices => Math.floor(Math.random() * indices);

  const getRandomEntityIdCreator = entityList => {
    const entityListCopy = [...entityList];

    return () => {
      const indices = entityListCopy.length;

      if (indices) {
        const entityIndex = randomIndex(indices);
        const entityId = entityListCopy[entityIndex].id;

        entityListCopy.splice(entityIndex, 1);

        return entityId;
      }

      return null;
    };
  };

  // init 10 Users
  for (let i = 0; i < 10; i++) {
    DB.USERS[i] = new User({
      name: mockdata.name(),
      login: `${mockdata.name()}${mockdata.chars(1, 5)}`,
      password: `${mockdata.chars(5, 10)}`
    });
  }

  // init 15 Tasks
  const getRandomUserId = getRandomEntityIdCreator(DB.USERS);
  for (let i = 0; i < 15; i++) {
    const randomUserId = getRandomUserId();

    DB.TASKS[i] = new Task({
      title: mockdata.title(5, 8),
      order: i,
      description: mockdata.sentences(1, 3, 5, 8),
      userId: randomUserId
    });
  }

  // init 3 Columns
  for (let i = 0; i < COLUMN_NAMES.length; i++) {
    DB.COLUMNS[i] = new Column({
      title: COLUMN_NAMES[i],
      order: i,
      tasks: []
    });
  }

  // fill each Column with tasks equally (if possible)
  const getRandomTaskId = getRandomEntityIdCreator(DB.TASKS);
  for (const column of DB.COLUMNS) {
    const quantity = DB.TASKS.length / DB.COLUMNS.length;

    for (let i = 0; i < quantity; i++) {
      const randomTaskId = getRandomTaskId();

      const taskToUpdate = DB.TASKS.find(task => task.id === randomTaskId);

      taskToUpdate.columnId = column.id;

      randomTaskId && column.tasks.push(randomTaskId);
    }
  }

  // init 1 Board
  DB.BOARDS.push(
    new Board({
      title: mockdata.title(5, 8),
      columns: [...DB.COLUMNS]
    })
  );

  //  update Tasks with BoardId
  DB.BOARDS.forEach(board => {
    board.columns.forEach(column =>
      column.tasks.forEach(taskId => {
        const taskToUpdate = DB.TASKS.find(task => task.id === taskId);
        if (taskToUpdate) taskToUpdate.boardId = board.id;
      })
    );
  });
}

initDB();

const getAll = async entityName => {
  return DB[entityName];
};

const getEntityById = async (entityName, id) => {
  return DB[entityName].find(entity => entity.id === id);
};

const createEntity = async (entityName, entity) => {
  if (!entity) throw new Error('invalid entity');

  const isExisting = DB[entityName].includes(record => record.id === entity.id);

  if (!isExisting) return DB[entityName].push(entity) && entity;
};

const updateEntity = async (entityName, entityId, entityData) => {
  const entityToUpdate = DB[entityName].find(entity => entity.id === entityId);

  if (entityToUpdate) {
    for (const entityKey of Object.getOwnPropertyNames(entityData)) {
      // check if an existing object has a field to update
      if (entityKey in entityToUpdate) {
        entityToUpdate[entityKey] = entityData[entityKey];
      } else throw new Error('invalid entity');
    }
  }

  return entityToUpdate;
};

const deleteEntity = async (entityName, id) => {
  return DB[entityName].find((entity, idx, thisEntityCollection) => {
    const idsAreEqual = entity.id === id;

    if (idsAreEqual) thisEntityCollection.splice(idx, 1);

    return idsAreEqual;
  });
};

module.exports = {
  getAll,
  getEntityById,
  createEntity,
  deleteEntity,
  updateEntity,
  TASKS,
  BOARDS,
  USERS,
  COLUMNS
};
