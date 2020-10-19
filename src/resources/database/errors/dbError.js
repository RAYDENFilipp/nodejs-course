const createIdNotFoundError = (entity, id) =>
  new Error(`${id} is not found in ${entity}`);

module.exports = createIdNotFoundError;
