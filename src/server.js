const app = require('./app');
const { initDB } = require('./resources/database/db');

(async cb => initDB(cb))(app.listen);
