const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const strategies = require("./passport");
const routes = require("../api/routes/v1");
const { logs } = require("./variables");
const error = require("../api/middlewares/error");
const path = require("path");

const app = express();

// Logs
app.use(morgan(logs));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Compress all requests
app.use(compress());

app.use(methodOverride());

app.use(cors());

app.use(helmet());

app.use(passport.initialize());
passport.use("jwt", strategies.jwt);

app.use("/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
