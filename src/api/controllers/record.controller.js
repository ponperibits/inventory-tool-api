/** * *
Record
* */
const httpStatus = require("http-status");
const Record = require("../models/record.model");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

exports.list = async (req, res, next) => {
  try {
    const records = await Record.list({
      ...req.query,
      userId: req.user._id,
    });
    res.json(records);
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

    let products = await Record.paginate(rest, {
      page: page || 1,
      limit: perPage || 30,
      sort: { transactionDate: -1 },
      populate: [
        { path: "supplierId", select: "name" },
        { path: "customerId", select: "name" },
        { path: "productId", select: "name" },
      ],
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const record = new Record({
      ...req.body,
      userId: req.user._id,
    });
    const savedRecord = await record.save();
    res.status(httpStatus.CREATED);
    res.json(savedRecord);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await Record.fetch(recordId);
    res.json(record);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    await Record.updateRecord(recordId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { recordId: _id } = req.params;
    await Record.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
