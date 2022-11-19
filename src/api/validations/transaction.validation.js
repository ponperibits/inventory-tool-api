/**
 *
 * Transaction
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/transaction
  createTransaction: {
    body: Joi.object({
      transactionDate: Joi.number().required(),
      amount: Joi.number().required(),
      currency: Joi.string().allow(""),
      records: Joi.array(),
    }),
  },

  // GET /v1/transaction
  listTransaction: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    }),
  },

  // GET /v1/transaction/:transactionId
  fetchTransaction: {
    params: Joi.object({
      transactionId: Joi.string().required(),
    }),
  },

  // PATCH /v1/transaction/:transactionId
  updateTransaction: {
    params: Joi.object({
      transactionId: Joi.string().required(),
    }),
    body: Joi.object({
      transactionDate: Joi.number().allow(""),
      amount: Joi.number().allow(""),
      currency: Joi.string().allow(""),
      records: Joi.array(),
    }),
  },

  // DELETE /v1/transaction/:transaction
  deleteTransaction: {
    params: Joi.object({
      transactionId: Joi.string().required(),
    }),
  },
};
