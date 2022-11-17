const path = require("path");

require("dotenv-safe").config({
  path: path.join(__dirname, "../../.env"),
  allowEmptyValues: true,
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINS,
  mongo: {
    uri:
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI_DEV
        : process.env.MONGO_URI_PROD,
  },
  logs: process.env.NODE_ENV === "development" ? "dev" : "combined",
};
