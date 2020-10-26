const mockdata = require('mockdata');
const mongoose = require('mongoose');
const User = require('../models/User');
const Board = require('../models/Board');
const Column = require('../models/Column');
const { getRandomEntityIdCreator } = require('./utils');
const { MONGO_CONNECTION_STRING } = require('../../../common/config');
const Task = require('../models/Task');

// INITIALIZATION STEP
const initDB = async () => {
  const DB = {
    BOARDS: [],
    TASKS: [],
    COLUMNS: [],
    USERS: []
  };

  const COLUMN_NAMES = ['Unassigned', 'In Progress', 'Done'];

  // init 10 Users
  for (let i = 0; i < 10; i++) {
    DB.USERS[i] = {
      _id: new mongoose.Types.ObjectId(),
      name: mockdata.name(),
      login: `${mockdata.name()}${mockdata.chars(1, 5)}`,
      password: `${mockdata.chars(5, 10)}`
    };
  }

  // init 15 Tasks
  const getRandomUserId = getRandomEntityIdCreator(DB.USERS);
  for (let i = 0; i < 15; i++) {
    const randomUserId = getRandomUserId();

    DB.TASKS[i] = {
      _id: new mongoose.Types.ObjectId(),
      title: mockdata.title(5, 8),
      order: i,
      description: mockdata.sentences(1, 3, 5, 8),
      userId: randomUserId
    };
  }

  // init 3 Columns
  for (let i = 0; i < COLUMN_NAMES.length; i++) {
    DB.COLUMNS[i] = {
      _id: new mongoose.Types.ObjectId(),
      title: COLUMN_NAMES[i],
      order: i,
      tasks: []
    };
  }

  // fill each Column with tasks equally (if possible)
  const getRandomTaskId = getRandomEntityIdCreator(DB.TASKS);
  for (const column of DB.COLUMNS) {
    const quantity = DB.TASKS.length / DB.COLUMNS.length;

    for (let i = 0; i < quantity; i++) {
      const randomTaskId = getRandomTaskId();

      const taskToUpdate = DB.TASKS.find(task => task._id === randomTaskId);

      taskToUpdate.columnId = column._id;

      randomTaskId && column.tasks.push(randomTaskId);
    }
  }

  // init 1 Board and push all tables to Mongo
  return Promise.all([
    User.insertMany(DB.USERS),
    Task.insertMany(DB.TASKS),
    Column.insertMany(DB.COLUMNS),
    new Board({
      title: mockdata.title(5, 8),
      columns: [...DB.COLUMNS]
    }).save()
  ]);
};

function connectDb() {
  // https://stackoverflow.com/questions/51960171/node63208-deprecationwarning-collection-ensureindex-is-deprecated-use-creat
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };
  mongoose.connect(MONGO_CONNECTION_STRING, mongooseOptions, err => {
    if (err) console.error('Initial connection error: ', err);
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async () => {
    await db.dropDatabase();
    await initDB();
  });
}

module.exports = {
  connectDb
};
