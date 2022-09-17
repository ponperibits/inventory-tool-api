/**
 *
 * Party
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/party
  createParty: {
    body: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().allow(""),
      type: Joi.string().required(),
      gstNumber: Joi.string().allow(""),
      panNumber: Joi.string().allow(""),
      category: Joi.string().allow(""),
      address: Joi.string().allow(""),
    }),
  },

  // GET /v1/party
  listParty: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
      type: Joi.string(),
      searchText: Joi.string().allow(""),
    }),
  },

  // GET /v1/party/:partyId
  fetchParty: {
    params: Joi.object({
      partyId: Joi.string().required(),
    }),
  },

  // PATCH /v1/party/:partyId
  updateParty: {
    params: Joi.object({
      partyId: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().allow(""),
      phone: Joi.string().allow(""),
      type: Joi.string().allow(""),
      gstNumber: Joi.string().allow(""),
      panNumber: Joi.string().allow(""),
      category: Joi.string().allow(""),
      address: Joi.string().allow(""),
    }),
  },

  // DELETE /v1/party/:party
  deleteParty: {
    params: Joi.object({
      partyId: Joi.string().required(),
    }),
  },
};
