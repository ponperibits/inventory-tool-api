/** * *
Transaction
* */
const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/transaction.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const {
  listTransaction,
  createTransaction,
  fetchTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../../validations/transaction.validation");
const router = express.Router();

router
  .route("/all") /** * @api {GET} v1/transaction/all List
  transaction
  * @apiDescription Get a list of
  transaction
  * @apiVersion 1.0.0 * @apiName Listtransaction
  * @apiGroup
  transaction
  * @apiPermission logged user * * @apiHeader {String} Authorization User's
  access token * * @apiParam {Number{1-}} [page=1] List page * @apiParam
  {Number{1-100}} [perPage=1]
  transactions per page * @apiParam {String} [fields=id title] Fields to
  be fetched * * @apiSuccess {Object[]} List of
  transactions. * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(authorize(LOGGED_USER), validate(listTransaction), controller.list);
router
  .route("") /** * @api {POST} v1/transaction
  Create
  transaction
  * @apiDescription Create an
  transaction
  * @apiVersion 1.0.0 * @apiName Createtransaction
  * @apiGroup
  transaction
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * Add body params here * * @apiSuccess (Created 201) * * @apiError
  (Unauthorized 401) Unauthorized Only authenticated users can access the data *
  @apiError (Forbidden 403) Forbidden Only admins can access the data */
  .post(authorize(LOGGED_USER), validate(createTransaction), controller.create);
router
  .route("/:transactionId") /** * @api {GET}
  v1/transaction/:transactionId Get
  transaction
  Details * @apiDescription Get a
  transaction
  Details * @apiVersion 1.0.0 * @apiName Fetchtransaction
  * @apiGroup
  transaction
  * @apiPermission Logged User * * @apiHeader {String} Authorization User's
  access token * * @apiParam {String}
  transactionId
  transaction's Id * * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(
    authorize(LOGGED_USER),
    validate(fetchTransaction),
    controller.fetch
  ) /** * @api {PATCH} v1/transaction/:transactionId Update
  transaction
  * @apiDescription Update an
  transaction
  * @apiVersion 1.0.0 * @apiName Updatetransaction
  * @apiGroup
  transaction
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  transactionId
  transaction's Id * * * @apiSuccess (No Content 204)
  transaction
  updated * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .patch(
    authorize(LOGGED_USER),
    validate(updateTransaction),
    controller.updateOne
  ) /** * @api {DELETE} v1/transaction/:transactionId
  transaction
  event * @apiDescription DELETE a
  transaction
  * @apiVersion 1.0.0 * @apiName Deletetransaction
  * @apiGroup
  transaction
  * @apiPermission Admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  transactionId
  transaction's Id * * @apiSuccess (No Content 204)
  transaction
  deleted * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .delete(
    authorize(LOGGED_USER),
    validate(deleteTransaction),
    controller.removeOne
  );

module.exports = router;
