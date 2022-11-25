/** * *
Transaction
* */
const httpStatus = require("http-status");
const Transaction = require("../models/transaction.model");
const Record = require("../models/record.model");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

exports.list = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
      userId: req.user._id,
    };
    const { page, perPage, ...rest } = _omitBy(query, (each) =>
      isNullorUndefined(each)
    );

    let transactions = await Transaction.paginate(rest, {
      page: page || 1,
      limit: perPage || 2,
      sort: { createdAt: -1 },
      populate: {
        path: "records",
        populate: {
          path: "productId supplierId customerId",
        },
      },
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { records, ...rest } = req.body;
    const transaction = new Transaction({
      ...rest,
      userId: req.user._id,
    });
    const savedTransaction = await transaction.save();

    let recordsToSave = [];
    for (const record of records) {
      const newRecord = new Record({
        ...record,
        userId: req.user._id,
        transactionId: savedTransaction._id,
      });
      recordsToSave.push(newRecord);
    }

    await Record.insertMany(recordsToSave);

    res.status(httpStatus.CREATED);
    res.json(savedTransaction);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.fetch(transactionId);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { records, ...rest } = req.body;
    await Transaction.updateTransaction(transactionId, rest);

    await Record.deleteMany({ transactionId });

    let recordsToSave = [];
    for (const record of records) {
      const newRecord = new Record({
        ...record,
        userId: req.user._id,
        transactionId: transactionId,
      });
      recordsToSave.push(newRecord);
    }
    await Record.insertMany(recordsToSave);

    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { transactionId: _id } = req.params;
    await Transaction.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
