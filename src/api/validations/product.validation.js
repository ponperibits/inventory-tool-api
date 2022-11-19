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
      price: Joi.number().required(),
      sellingPrice: Joi.number().required(),
      currency: Joi.string().allow(""),
      noOfUnits: Joi.number().allow(0),
      supplierId: Joi.string().required(),
    }),
  },

  // GET /v1/product
  listProduct: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
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
      price: Joi.number().allow(""),
      sellingPrice: Joi.number().allow(""),
      currency: Joi.string().allow(""),
      noOfUnits: Joi.number().allow(0),
      supplierId: Joi.string().allow(""),
    }),
  },

  // DELETE /v1/product/:product
  deleteProduct: {
    params: Joi.object({
      productId: Joi.string().required(),
    }),
  },
};
