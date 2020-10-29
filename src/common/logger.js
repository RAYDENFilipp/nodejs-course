const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');
const { LOG_FOLDER } = require('./config');
const { combine, timestamp, prettyPrint, cli, colorize } = format;
const combinedFormat = combine(timestamp(), prettyPrint());

const errorOptions = {
  format: combinedFormat,
  level: 'error',
  dirname: LOG_FOLDER,
  filename: 'error.log',
  maxSize: 5e6,
  maxFiles: 5,
  options: { flags: 'a+' }
};
// Ignore log messages if they have { error: true }
const ignoreErrors = format(info => {
  if (info.level === 'error') {
    return false;
  }
  return info;
});

const infoFormat = combine(combinedFormat, ignoreErrors());

const infoOptions = {
  ...errorOptions,
  format: infoFormat,
  level: 'info',
  filename: 'info.log'
};
const exceptionsOptions = { ...errorOptions, filename: 'exceptions.log' };
const rejectionsOptions = { ...errorOptions, filename: 'rejections.log' };

const logger = createLogger({
  transports: [
    new transports.File(errorOptions),
    new transports.File(infoOptions)
  ],
  exceptionHandlers: [new transports.File(exceptionsOptions)],
  rejectionHandlers: [new transports.File(rejectionsOptions)]
});

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), cli()),
      handleExceptions: true,
      handleRejections: true,
      colorize: true
    })
  );
}

const logRequests = expressWinston.logger({
  winstonInstance: logger,
  msg: (req, res) => {
    const { method, originalUrl, params, body } = req;
    const { statusCode, responseTime } = res;

    return `${method} ${originalUrl} ${`\nBODY: ${JSON.stringify(
      body,
      null,
      2
    )}`}${`\nPARAMS: ${JSON.stringify(
      params,
      null,
      2
    )}\n`}RESPONSE: ${statusCode} - ${responseTime}ms\n`;
  },
  level: (req, res) =>
    res.statusCode >= 400 && res.statusCode < 500 ? 'warn' : 'info',
  skip: (req, res) => res.statusCode >= 500
});

module.exports = { logger, logRequests };
