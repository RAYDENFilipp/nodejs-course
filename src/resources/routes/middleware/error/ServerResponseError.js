const { getReasonPhrase } = require('http-status-codes');

class ServerResponseError extends Error {
  constructor(status) {
    super(getReasonPhrase(status));
    this.status = status;
  }
}

module.exports = ServerResponseError;
