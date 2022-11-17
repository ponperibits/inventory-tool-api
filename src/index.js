Promise = require("bluebird");
const { env, port } = require("./config/variables");
const app = require("./config/expressApp");
const mongoose = require("./config/mongoose");

mongoose.connect();

app.listen(port, () => console.log(`Server started on port ${port} (${env})`));

module.exports = app;
