/** * *
Product
* */
const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/product.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const {
  listProduct,
  createProduct,
  fetchProduct,
  updateProduct,
  deleteProduct,
} = require("../../validations/product.validation");
const router = express.Router();

router.route("/paginate").get(authorize(LOGGED_USER), controller.paginate);

router
  .route("/all") /** * @api {GET} v1/product/all List
  product
  * @apiDescription Get a list of
  product
  * @apiVersion 1.0.0 * @apiName Listproduct
  * @apiGroup
  product
  * @apiPermission logged user * * @apiHeader {String} Authorization User's
  access token * * @apiParam {Number{1-}} [page=1] List page * @apiParam
  {Number{1-100}} [perPage=1]
  products per page * @apiParam {String} [fields=id title] Fields to
  be fetched * * @apiSuccess {Object[]} List of
  products. * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(authorize(LOGGED_USER), validate(listProduct), controller.list);
router
  .route("") /** * @api {POST} v1/product
  Create
  product
  * @apiDescription Create an
  product
  * @apiVersion 1.0.0 * @apiName Createproduct
  * @apiGroup
  product
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * Add body params here * * @apiSuccess (Created 201) * * @apiError
  (Unauthorized 401) Unauthorized Only authenticated users can access the data *
  @apiError (Forbidden 403) Forbidden Only admins can access the data */
  .post(authorize(LOGGED_USER), validate(createProduct), controller.create);
router
  .route("/:productId") /** * @api {GET}
  v1/product/:productId Get
  product
  Details * @apiDescription Get a
  product
  Details * @apiVersion 1.0.0 * @apiName Fetchproduct
  * @apiGroup
  product
  * @apiPermission Logged User * * @apiHeader {String} Authorization User's
  access token * * @apiParam {String}
  productId
  product's Id * * * @apiError (Unauthorized 401) Unauthorized Only
  authenticated users can access the data * @apiError (Forbidden 403) Forbidden
  Only admins can access the data */
  .get(
    authorize(LOGGED_USER),
    validate(fetchProduct),
    controller.fetch
  ) /** * @api {PATCH} v1/product/:productId Update
  product
  * @apiDescription Update an
  product
  * @apiVersion 1.0.0 * @apiName Updateproduct
  * @apiGroup
  product
  * @apiPermission admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  productId
  product's Id * * * @apiSuccess (No Content 204)
  product
  updated * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .patch(
    authorize(LOGGED_USER),
    validate(updateProduct),
    controller.updateOne
  ) /** * @api {DELETE} v1/product/:productId
  product
  event * @apiDescription DELETE a
  product
  * @apiVersion 1.0.0 * @apiName Deleteproduct
  * @apiGroup
  product
  * @apiPermission Admin * * @apiHeader {String} Authorization User's access
  token * * @apiParam {String}
  productId
  product's Id * * @apiSuccess (No Content 204)
  product
  deleted * * @apiError (Unauthorized 401) Unauthorized Only authenticated users
  can access the data * @apiError (Forbidden 403) Forbidden Only admins can
  access the data */
  .delete(
    authorize(LOGGED_USER),
    validate(deleteProduct),
    controller.removeOne
  );

module.exports = router;
