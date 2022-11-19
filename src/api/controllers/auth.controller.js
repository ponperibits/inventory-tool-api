const httpStatus = require("http-status");
const User = require("../models/user.model");
const EmailVerification = require("../models/emailVerification.model");
const APIError = require("../utils/APIError");
const emailProvider = require("../services/emails/emailProvider");

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await User.findOne({
      email: userData.email,
    });
    if (user) {
      var err = {
        status: httpStatus.CONFLICT,
        message: "Email Address already exits. Please login",
      };
      throw new APIError(err);
    }

    await sendEmailVerification(userData);
    res.status(httpStatus.OK);
    return res.json("Verification email sent");
  } catch (error) {
    return next(error);
  }
};

async function sendEmailVerification(user) {
  if (user) {
    const verificationObj = await EmailVerification.findOne({
      email: user.email,
    });

    if (!verificationObj) {
      const emailVerifyObj = await EmailVerification.generate(user);
      emailProvider.sendEmailVerification(emailVerifyObj);
      return;
    }

    const newVerificationObj = verificationObj.resetCode();
    emailProvider.sendEmailVerification(newVerificationObj);
    return;
  }
  throw new APIError({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: "Unable to save user details",
  });
}
