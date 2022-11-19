/**
 *
 * Record
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/record
  createRecord: {
    body: Joi.object({}),
  },

  // GET /v1/record
  listRecord: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
      productId: Joi.string(),
      supplierId: Joi.string(),
      customerId: Joi.string(),
    }),
  },

  // GET /v1/record/:recordId
  fetchRecord: {
    params: Joi.object({
      recordId: Joi.string().required(),
    }),
  },

  // PATCH /v1/record/:recordId
  updateRecord: {
    params: Joi.object({
      recordId: Joi.string().required(),
    }),
    body: Joi.object({}),
  },

  // DELETE /v1/record/:record
  deleteRecord: {
    params: Joi.object({
      recordId: Joi.string().required(),
    }),
  },
};
