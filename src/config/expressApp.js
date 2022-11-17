const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const { logs } = require("./variables");
const path = require("path");

const app = express();

// Logs
app.use(morgan(logs));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Compress all requests
app.use(compress());

module.exports = app;
