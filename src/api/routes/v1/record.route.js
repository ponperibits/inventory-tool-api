/** * *
Record
* */

const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/record.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const {
  listRecord,
  createRecord,
  fetchRecord,
  updateRecord,
  deleteRecord,
} = require("../../validations/record.validation");
const router = express.Router();

router
  .route("/all") /** * @api {GET} v1/record/all List
  record
  * @apiDescription Get a list of
  record
  * @apiVersion 1.0.0 * @apiName Listrecord
  * @apiGroup
  record
  * @apiPermission logged user * * @apiHeader {String} Authorization User's
  access token * * @apiParam {Number{1-}} [page=1] List page * @apiParam
  {Number{1-100}} [perPage=1]
  records per page * @apiParam {String} [fields=id title] Fields to
  be fetched * * @apiSuccess {Object[]} List of
  records. * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(authorize(LOGGED_USER), validate(listRecord), controller.list);
router
  .route("") /** * @api {POST} v1/record
  Create
  record
  * @apiDescription Create an
  record
  * @apiVersion 1.0.0 * @apiName Createrecord
  * @apiGroup
  record
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * Add body params here * * @apiSuccess (Created 201) * * @apiError
  (Unauthorized 401) Unauthorized Only authenticated users can access the data *
  @apiError (Forbidden 403) Forbidden Only admins can access the data */
  .post(authorize(LOGGED_USER), validate(createRecord), controller.create);
router
  .route("/:recordId") /** * @api {GET}
  v1/record/:recordId Get
  record
  Details * @apiDescription Get a
  record
  Details * @apiVersion 1.0.0 * @apiName Fetchrecord
  * @apiGroup
  record
  * @apiPermission Logged User * * @apiHeader {String} Authorization User's
  access token * * @apiParam {String}
  recordId
  record's Id * * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(
    authorize(LOGGED_USER),
    validate(fetchRecord),
    controller.fetch
  ) /** * @api {PATCH} v1/record/:recordId Update
  record
  * @apiDescription Update an
  record
  * @apiVersion 1.0.0 * @apiName Updaterecord
  * @apiGroup
  record
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  recordId
  record's Id * * * @apiSuccess (No Content 204)
  record
  updated * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .patch(
    authorize(LOGGED_USER),
    validate(updateRecord),
    controller.updateOne
  ) /** * @api {DELETE} v1/record/:recordId
  record
  event * @apiDescription DELETE a
  record
  * @apiVersion 1.0.0 * @apiName Deleterecord
  * @apiGroup
  record
  * @apiPermission Admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  recordId
  record's Id * * @apiSuccess (No Content 204)
  record
  deleted * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .delete(authorize(LOGGED_USER), validate(deleteRecord), controller.removeOne);

module.exports = router;
