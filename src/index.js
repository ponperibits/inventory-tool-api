Promise = require("bluebird");
const { env, port } = require("./config/variables");
const logger = require("./config/logger");
const app = require("./config/expressApp");
const mongoose = require("./config/mongoose");

mongoose.connect();

app.listen(port, () => logger.info(`Server started on port ${port} (${env})`));

module.exports = app;
