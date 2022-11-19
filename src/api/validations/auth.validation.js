const Joi = require("joi");

module.exports = {
  // POST /v1/auth/register
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
      name: Joi.string().required(),
      orgName: Joi.string().required(),
      phone: Joi.string().required(),
    }),
  },

  // POST /v1/auth/verify-code
  emailVerification: {
    body: Joi.object({
      email: Joi.string().email().required(),
      code: Joi.string().length(6),
    }),
  },
};
