/** * *
Transaction
* */
const httpStatus = require("http-status");
const Transaction = require("../models/transaction.model");
const Record = require("../models/record.model");
const Product = require("../models/product.model");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");
const APIError = require("../utils/APIError");
const { get, isEmpty } = require("lodash");

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
      limit: perPage || 30,
      sort: { transactionDate: -1 },
      populate: [
        { path: "supplierId", select: "name" },
        { path: "customerId", select: "name" },
        {
          path: "records",
          populate: {
            path: "productId supplierId customerId",
          },
        },
      ],
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
      const prodUnitsOpening = await findOpeningBalance(
        get(record, "productId._id"),
        savedTransaction.transactionDate
      );

      const newRecord = new Record({
        ...record,
        prodUnitsOpening,
        ...(savedTransaction.supplierId && {
          prodUnitsBalance: prodUnitsOpening + get(record, "noOfUnits"),
          userId: req.user._id,
        }),
        ...(savedTransaction.customerId && {
          prodUnitsBalance: prodUnitsOpening - get(record, "noOfUnits"),
          userId: req.user._id,
        }),
        transactionId: savedTransaction._id,
        transactionDate: savedTransaction.transactionDate,
        ...(savedTransaction.supplierId && {
          supplierId: savedTransaction.supplierId,
        }),
        ...(savedTransaction.customerId && {
          customerId: savedTransaction.customerId,
        }),
      });
      recordsToSave.push(newRecord);
    }

    await adjustProductQuantity(recordsToSave);
    await adjustOtherRecords(recordsToSave);
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

    const existingRecords = await Record.find({ transactionId });
    const existingTransaction = await Transaction.fetch(transactionId);
    await adjustProductQuantity(existingRecords, -1);
    await adjustOtherRecords(existingRecords, -1);
    await Record.deleteMany({ transactionId });

    const updatedTransaction = await Transaction.fetch(transactionId);

    let recordsToSave = [];
    for (const record of records) {
      const prodUnitsOpening = await findOpeningBalance(
        get(record, "productId._id"),
        existingTransaction.transactionDate
      );

      const newRecord = new Record({
        ...record,
        prodUnitsOpening,
        ...(updatedTransaction.supplierId && {
          prodUnitsBalance: prodUnitsOpening + get(record, "noOfUnits"),
          userId: req.user._id,
        }),
        ...(updatedTransaction.customerId && {
          prodUnitsBalance: prodUnitsOpening - get(record, "noOfUnits"),
          userId: req.user._id,
        }),
        userId: req.user._id,
        transactionId,
        transactionDate: updatedTransaction.transactionDate,
        ...(updatedTransaction.supplierId && {
          supplierId: updatedTransaction.supplierId,
        }),
        ...(updatedTransaction.customerId && {
          customerId: updatedTransaction.customerId,
        }),
      });
      recordsToSave.push(newRecord);
    }

    await adjustProductQuantity(recordsToSave);
    await adjustOtherRecords(recordsToSave);
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
    const existingRecords = await Record.find({ transactionId: _id });
    await adjustProductQuantity(existingRecords, -1);
    await adjustOtherRecords(existingRecords, -1);

    await Record.deleteMany({ transactionId: _id });

    await Transaction.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

const adjustProductQuantity = async (records, multiplier = 1) => {
  for (const record of records) {
    const { productId, noOfUnits, supplierId } = record;
    await Product.updateOne(
      { _id: productId },
      {
        $inc: {
          noOfUnits: supplierId
            ? multiplier * noOfUnits
            : multiplier * -noOfUnits,
        },
      }
    );
  }
};

const findOpeningBalance = async (productId, transactionDate) => {
  const latestRecord = await Record.findOne({
    productId,
    transactionDate: { $lte: transactionDate },
  });

  if (isEmpty(latestRecord)) {
    return 0;
  }

  return get(latestRecord, "prodUnitsBalance");
};

const adjustOtherRecords = async (records, multiplier = 1) => {
  for (const record of records) {
    const { productId, noOfUnits, transactionDate, supplierId } = record;
    await Record.updateMany(
      {
        productId,
        transactionDate: { $gt: transactionDate },
      },
      {
        $inc: {
          prodUnitsOpening: supplierId
            ? multiplier * noOfUnits
            : multiplier * -noOfUnits,
          prodUnitsBalance: supplierId
            ? multiplier * noOfUnits
            : multiplier * -noOfUnits,
        },
      }
    );
  }
};
