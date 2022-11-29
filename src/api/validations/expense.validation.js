/**
 *
 * Expense
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/expense
  createExpense: {
    body: Joi.object({
      transactionDate: Joi.number().required(),
      title: Joi.string().required(),
      amount: Joi.number().required(),
      notes: Joi.string().allow(""),
    }),
  },

  // GET /v1/expense
  listExpense: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    }),
  },

  // GET /v1/expense/:expenseId
  fetchExpense: {
    params: Joi.object({
      expenseId: Joi.string().required(),
    }),
  },

  // PATCH /v1/expense/:expenseId
  updateExpense: {
    params: Joi.object({
      expenseId: Joi.string().required(),
    }),
    body: Joi.object({
      transactionDate: Joi.number(),
      title: Joi.string().allow(""),
      amount: Joi.number(),
      notes: Joi.string().allow(""),
    }),
  },

  // DELETE /v1/expense/:expense
  deleteExpense: {
    params: Joi.object({
      expenseId: Joi.string().required(),
    }),
  },
};
