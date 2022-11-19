const httpStatus = require("http-status");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const EmailVerification = require("../models/emailVerification.model");
const APIError = require("../utils/APIError");
const moment = require("moment-timezone");
const emailProvider = require("../services/emails/emailProvider");
const { jwtExpirationInterval } = require("../../config/variables");
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

exports.resendEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await EmailVerification.findOne({ email }).exec();
    if (!user) {
      const err = {
        status: httpStatus.BAD_REQUEST,
        message: "Email id not registered. Please register again",
      };
      throw new APIError(err);
    }
    const updatedObj = user.resetCode();
    emailProvider.sendEmailVerification(updatedObj);
    return res.json("Email resent");
  } catch (error) {
    return next(error);
  }
};

exports.emailVerification = async (req, res, next) => {
  try {
    const { email: userEmail, code } = req.body;
    const verificationObj = await EmailVerification.findOne({
      email: userEmail,
      code,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (!verificationObj) {
      err.message = "Entered verification is invalid";
      throw new APIError(err);
    }

    if (moment().isAfter(verificationObj.expires)) {
      err.message = "Verification code has expired";
      throw new APIError(err);
    }

    const { email, password, name, orgName, phone } = verificationObj;

    const response = await saveUser({
      email,
      password,
      name,
      orgName,
      phone,
    });

    await EmailVerification.deleteOne({ email, code });

    res.status(httpStatus.CREATED);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};

async function saveUser(newUser) {
  const user = await new User(newUser).save();
  const userTransformed = user.transform();
  const token = generateTokenResponse(user, user.token());
  return { user: userTransformed, token };
}

function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}
