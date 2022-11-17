const mongoose = require("mongoose");
const logger = require("./../config/logger");
const { env, mongo } = require("./variables");

mongoose.Promise = Promise;

mongoose.connection.on("error", (error) => {
  logger.error(`MongoDB connection error: ${error}`);
  process.exit(-1);
});

if (env === "development") {
  mongoose.set("debug", true);
}

exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected..."));

  return mongoose.connection;
};
