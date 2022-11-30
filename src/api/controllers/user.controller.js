const httpStatus = require("http-status");
const User = require("../models/user.model");

exports.fetch = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id }).exec();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.updateUser(_id, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
