/** * *
Party
* */
const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/party.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const {
  listParty,
  createParty,
  fetchParty,
  updateParty,
  deleteParty,
} = require("../../validations/party.validation");
const router = express.Router();

router
  .route("/all") /** * @api {GET} v1/party/all List
  party
  * @apiDescription Get a list of
  party
  * @apiVersion 1.0.0 * @apiName Listparty
  * @apiGroup
  party
  * @apiPermission logged user * * @apiHeader {String} Authorization User's
  access token * * @apiParam {Number{1-}} [page=1] List page * @apiParam
  {Number{1-100}} [perPage=1]
  partys per page * @apiParam {String} [fields=id title] Fields to
  be fetched * * @apiSuccess {Object[]} List of
  partys. * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(authorize(LOGGED_USER), validate(listParty), controller.list);
router
  .route("") /** * @api {POST} v1/party
  Create
  party
  * @apiDescription Create an
  party
  * @apiVersion 1.0.0 * @apiName Createparty
  * @apiGroup
  party
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * Add body params here * * @apiSuccess (Created 201) * * @apiError
  (Unauthorized 401) Unauthorized Only authenticated users can access the data *
  @apiError (Forbidden 403) Forbidden Only admins can access the data */
  .post(authorize(LOGGED_USER), validate(createParty), controller.create);
router
  .route("/:partyId") /** * @api {GET}
  v1/party/:partyId Get
  party
  Details * @apiDescription Get a
  party
  Details * @apiVersion 1.0.0 * @apiName Fetchparty
  * @apiGroup
  party
  * @apiPermission Logged User * * @apiHeader {String} Authorization User's
  access token * * @apiParam {String}
  partyId
  party's Id * * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(
    authorize(LOGGED_USER),
    validate(fetchParty),
    controller.fetch
  ) /** * @api {PATCH} v1/party/:partyId Update
  party
  * @apiDescription Update an
  party
  * @apiVersion 1.0.0 * @apiName Updateparty
  * @apiGroup
  party
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  partyId
  party's Id * * * @apiSuccess (No Content 204)
  party
  updated * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .patch(
    authorize(LOGGED_USER),
    validate(updateParty),
    controller.updateOne
  ) /** * @api {DELETE} v1/party/:partyId
  party
  event * @apiDescription DELETE a
  party
  * @apiVersion 1.0.0 * @apiName Deleteparty
  * @apiGroup
  party
  * @apiPermission Admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  partyId
  party's Id * * @apiSuccess (No Content 204)
  party
  deleted * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .delete(authorize(LOGGED_USER), validate(deleteParty), controller.removeOne);

module.exports = router;
