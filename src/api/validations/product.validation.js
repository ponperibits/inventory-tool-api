/**
 *
 * Product
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/product
  createProduct: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(""),
      sku: Joi.string().required(),
      price: Joi.number().required(),
      sellingPrice: Joi.number().required(),
      minStockWarning: Joi.number().allow(0),
    }),
  },

  // GET /v1/product
  listProduct: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
      searchText: Joi.string().allow(""),
    }),
  },

  // GET /v1/product/:productId
  fetchProduct: {
    params: Joi.object({
      productId: Joi.string().required(),
    }),
  },

  // PATCH /v1/product/:productId
  updateProduct: {
    params: Joi.object({
      productId: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().allow(""),
      description: Joi.string().allow(""),
      sku: Joi.string().allow(""),
      price: Joi.number().allow(""),
      sellingPrice: Joi.number().allow(""),
      noOfUnits: Joi.number().allow(0),
      minStockWarning: Joi.number().allow(0),
    }),
  },

  // DELETE /v1/product/:product
  deleteProduct: {
    params: Joi.object({
      productId: Joi.string().required(),
    }),
  },
};
