const express = require("express");
const controller = require("../../controllers/commonDetail.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/dashboardStats")
  .get(authorize(LOGGED_USER), controller.getDashboardStats);

module.exports = router;
