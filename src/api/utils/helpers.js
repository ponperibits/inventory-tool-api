const _isNull = require("lodash/isNull");
const _isUndefined = require("lodash/isUndefined");

const isNullorUndefined = (value) =>
  _isNull(value) ||
  _isUndefined(value) ||
  value == "null" ||
  value == "undefined";

module.exports = {
  isNullorUndefined,
};
