const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const userRouter = require('./resources/routes/api/user');
const boardRouter = require('./resources/routes/api/board');
const taskRouter = require('./resources/routes/api/task');
const {
  logRequests,
  logErrors,
  logUnhandledErrors
} = require('./resources/routes/middleware/logger');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

logUnhandledErrors();

app.use(express.json());

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(logRequests);

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', userRouter);
app.use('/boards', boardRouter, taskRouter);

app.use(logErrors);

module.exports = app;
