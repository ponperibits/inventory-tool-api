/** * *
Expense
* */
const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/expense.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const {
  listExpense,
  createExpense,
  fetchExpense,
  updateExpense,
  deleteExpense,
} = require("../../validations/expense.validation");
const router = express.Router();

router.route("/paginate").get(authorize(LOGGED_USER), controller.paginate);

router
  .route("/all")
  /** * @api {GET} v1/expense/all List expense
  * @apiDescription Get a list of expense
  * @apiVersion 1.0.0 
  * @apiName Listexpense
  * @apiGroup expense
  * @apiPermission logged user * * @apiHeader {String} Authorization User's
  access token * * @apiParam {Number{1-}} [page=1] List page * @apiParam
  {Number{1-100}} [perPage=1]
  expenses per page * @apiParam {String} [fields=id title] Fields to
  be fetched * * @apiSuccess {Object[]} List of
  expenses. * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(authorize(LOGGED_USER), validate(listExpense), controller.list);
router
  .route("") /** * @api {POST} v1/expense
  Create
  expense
  * @apiDescription Create an
  expense
  * @apiVersion 1.0.0 * @apiName Createexpense
  * @apiGroup
  expense
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * Add body params here * * @apiSuccess (Created 201) * * @apiError
  (Unauthorized 401) Unauthorized Only authenticated users can access the data *
  @apiError (Forbidden 403) Forbidden Only admins can access the data */
  .post(authorize(LOGGED_USER), validate(createExpense), controller.create);
router
  .route("/:expenseId") /** * @api {GET}
  v1/expense/:expenseId Get
  expense
  Details * @apiDescription Get a
  expense
  Details * @apiVersion 1.0.0 * @apiName Fetchexpense
  * @apiGroup
  expense
  * @apiPermission Logged User * * @apiHeader {String} Authorization User's
  access token * * @apiParam {String}
  expenseId
  expense's Id * * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(
    authorize(LOGGED_USER),
    validate(fetchExpense),
    controller.fetch
  ) /** * @api {PATCH} v1/expense/:expenseId Update
  expense
  * @apiDescription Update an
  expense
  * @apiVersion 1.0.0 * @apiName Updateexpense
  * @apiGroup
  expense
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  expenseId
  expense's Id * * * @apiSuccess (No Content 204)
  expense
  updated * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .patch(
    authorize(LOGGED_USER),
    validate(updateExpense),
    controller.updateOne
  ) /** * @api {DELETE} v1/expense/:expenseId
  expense
  event * @apiDescription DELETE a
  expense
  * @apiVersion 1.0.0 * @apiName Deleteexpense
  * @apiGroup
  expense
  * @apiPermission Admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  expenseId
  expense's Id * * @apiSuccess (No Content 204)
  expense
  deleted * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .delete(
    authorize(LOGGED_USER),
    validate(deleteExpense),
    controller.removeOne
  );

module.exports = router;
