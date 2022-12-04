/** * *
Product
* */
const httpStatus = require("http-status");
const Product = require("../models/product.model");
const Record = require("../models/record.model");
const _omitBy = require("lodash/omitBy");
const { isEmpty } = require("lodash");
const { isNullorUndefined } = require("../utils/helpers");
const APIError = require("../utils/APIError");

exports.list = async (req, res, next) => {
  try {
    const products = await Product.list({
      ...req.query,
      userId: req.user._id,
    });
    res.json(products);
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

    let products = await Product.paginate(rest, {
      page: page || 1,
      limit: perPage || 30,
      sort: { createdAt: -1 },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const product = new Product({
      ...req.body,
      userId: req.user._id,
    });
    const savedProduct = await product.save();
    res.status(httpStatus.CREATED);
    res.json(savedProduct);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.fetch(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await Product.updateProduct(productId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { productId: _id } = req.params;
    const existingRecords = await Record.find({ productId: _id });

    if (!isEmpty(existingRecords)) {
      throw new APIError({
        message: "Cannot delete product with existing records!",
        status: httpStatus.BAD_REQUEST,
      });
    }

    await Product.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
