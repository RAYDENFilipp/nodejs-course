const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const helmet = require('helmet');
const cors = require('cors');
require('express-async-errors');
const userRouter = require('./resources/routes/api/user');
const boardRouter = require('./resources/routes/api/board');
const taskRouter = require('./resources/routes/api/task');
const loginMiddleware = require('./resources/routes/middleware/loginMiddleware');
const authenticateUser = require('./resources/routes/middleware/authenticateUser');
const errorHandler = require('./resources/routes/middleware/errorHandler');
const { logRequests } = require('./common/logger');

const app = express();
app.use(helmet());
app.use(cors());
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

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
app.use('/login', loginMiddleware);
app.use(/\/users|\/boards/, authenticateUser);
app.use('/users', userRouter);
app.use('/boards', boardRouter, taskRouter);

app.use(errorHandler);

module.exports = app;
