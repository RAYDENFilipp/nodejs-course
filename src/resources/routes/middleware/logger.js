const fs = require('fs');
const { finished } = require('stream');
const colors = require('colors');
const { StatusCodes } = require('http-status-codes');
const {
  METHODS: { GET, POST, PUT, DELETE }
} = require('../../../common/config');

colors.setTheme({
  get: 'brightCyan',
  post: 'brightGreen',
  put: 'brightYellow',
  delete: 'brightMagenta',
  error: 'brightRed',
  default: 'reset'
});

const logRequests = async (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, params, body } = req;
  const writeFile = data =>
    fs.writeFile('requests.log', `${data}\n`, { flag: 'a+' }, err => next(err));

  finished(res, async () => {
    const end = Date.now() - start;
    const { statusCode } = res;

    if (statusCode < 500) {
      const simpleOutput = `${method} ${originalUrl} RESPONSE: ${statusCode} - [${end}]ms`;
      const fullOutput = `${method} ${originalUrl}\nPARAMS: ${
        params && Object.keys(params).length
          ? JSON.stringify(params, null, 2)
          : 'none provided'
      }\nBODY: ${JSON.stringify(
        body,
        null,
        2
      )}\nRESPONSE: ${statusCode}\nELAPSED TIME: [${end}]ms
    `;

      const writeQueue = [];

      switch (req.method) {
        case GET:
          console.log(colors.get(simpleOutput));
          writeQueue.push(writeFile(simpleOutput));
          break;
        case POST:
          console.log(colors.post(fullOutput));
          writeQueue.push(writeFile(fullOutput));
          break;
        case PUT:
          console.log(colors.put(fullOutput));
          writeQueue.push(writeFile(fullOutput));
          break;
        case DELETE:
          console.log(colors.delete(simpleOutput));
          writeQueue.push(writeFile(simpleOutput));
          break;
        default:
          console.log(colors.default(simpleOutput));
          writeQueue.push(writeFile(simpleOutput));
      }

      await Promise.all(writeQueue);
    }
  });

  next();
};

// eslint-disable-next-line no-unused-vars
const logErrors = async (err, req, res, next) => {
  const errorMessage = `STATUS: ${StatusCodes.INTERNAL_SERVER_ERROR} ERROR: {
    stack: ${err.stack}
  }`;
  console.log(colors.error(errorMessage));

  const writeFile = data =>
    fs.writeFile('errors.log', `${data}\n`, { flag: 'a+' }, () => {});

  await writeFile(errorMessage);

  res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
};

const logUnhandledErrors = () => {
  const writeFileSync = data =>
    // eslint-disable-next-line no-sync
    fs.writeFileSync('errors.log', `${data}\n`, { flag: 'a+' }, () => {});

  const processError = (err, origin) => {
    const errorMessage = `Unhandled Error: {\nStack: ${
      err.stack
    }\nOrigin: ${JSON.stringify(origin)}\n}`;
    console.log(colors.error(errorMessage));
    writeFileSync(errorMessage);
  };

  const processRejection = (reason, promise) => {
    const errorMessage = `Unhandled Rejection: {\nReason: ${reason}\nPromise: ${JSON.stringify(
      promise
    )}\n}`;
    console.log(colors.error(errorMessage));
    writeFileSync(errorMessage);
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  };

  process
    .once('exit', code =>
      console.log(
        colors.bgBlue.white(
          ` This server has been killed on purpose with the code ${code} `
        )
      )
    )
    .once('uncaughtException', processError)
    .once('unhandledRejection', processRejection);
};

module.exports = {
  logRequests,
  logErrors,
  logUnhandledErrors
};
