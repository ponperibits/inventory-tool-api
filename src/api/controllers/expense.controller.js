const httpStatus = require("http-status");
const Expense = require("../models/expense.model");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

exports.list = async (req, res, next) => {
  try {
    const expenses = await Expense.list({
      ...req.query,
      userId: req.user._id,
    });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

exports.paginate = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
      userId: req.user._id,
    };

    const { page, perPage, ...rest } = _omitBy(query, (each) =>
      isNullorUndefined(each)
    );

    let expenses = await Expense.paginate(rest, {
      page: page || 1,
      limit: perPage || 30,
      sort: { createdAt: -1 },
    });

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const expense = new Expense({
      ...req.body,
      userId: req.user._id,
    });
    const savedExpense = await expense.save();
    res.status(httpStatus.CREATED);
    res.json(savedExpense);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.fetch(expenseId);
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    await Expense.updateExpense(expenseId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { expenseId: _id } = req.params;
    await Expense.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
