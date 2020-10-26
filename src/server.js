const app = require('./app');
const { PORT } = require('./common/config');
const { connectDb } = require('./resources/database/db');

connectDb();

app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
