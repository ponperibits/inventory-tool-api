const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { emailVerification: config } = require("../../config/variables");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");

const generateRandom = () => Math.floor(Math.random() * 899999 + 100099);

const emailVerificationSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  expires: { type: Date },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  orgName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
  },
});

emailVerificationSchema.method({
  resetCode() {
    const code = `${generateRandom()}`;
    const expires = moment().add(config.codeExpiry, "m").toDate();
    this.code = code;
    this.expires = expires;
    this.save();
    return this;
  },
});

emailVerificationSchema.statics = {
  async generate(user) {
    try {
      const { email: userEmail, password, name, orgName, phone } = user;
      const code = `${generateRandom()}`;
      const expires = moment().add(config.codeExpiry, "m").toDate();
      const verifyObj = new EmailVerification({
        code,
        userEmail,
        expires,
        password,
        name,
        orgName,
        phone,
      });
      await verifyObj.save();
      return verifyObj;
    } catch (error) {
      const err = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
      throw new APIError(err);
    }
  },
};

const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
module.exports = EmailVerification;
