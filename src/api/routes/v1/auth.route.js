const express = require("express");
const { validate } = require("express-validation");
const {
  register,
  login,
  refresh,
  emailVerification,
  resendVerification,
} = require("../../validations/auth.validation");
const controller = require("../../controllers/auth.controller");

const router = express.Router();

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{6..128}}  password  User's password
 *
 * @apiSuccess (Success 201) {String}  Email is sent with verification codes
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route("/register").post(validate(register), controller.register);

router.route("/login").post(validate(login), controller.login);

router.route("/refresh-token").post(validate(refresh), controller.refresh);

router
  .route("/verify-code")
  .post(validate(emailVerification), controller.emailVerification);
router
  .route("/resend-verification")
  .post(validate(resendVerification), controller.resendEmailVerification);
module.exports = router;
