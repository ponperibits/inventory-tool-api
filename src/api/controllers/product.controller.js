/** * *
Product
* */
const httpStatus = require("http-status");
const Product = require("../models/product.model");

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
    await Product.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
