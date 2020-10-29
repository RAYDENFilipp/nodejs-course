const app = require('./app');
const { logger } = require('./common/logger');
const { PORT } = require('./common/config');
const { connectDb } = require('./resources/database/db');

connectDb(app);

app.listen(PORT, () =>
  logger.info(`App is running on http://localhost:${PORT}`)
);
