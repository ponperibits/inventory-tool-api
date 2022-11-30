const express = require("express");
const controller = require("../../controllers/user.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const router = express.Router();

router.route("").get(authorize(LOGGED_USER), controller.fetch);
router.route("").patch(authorize(LOGGED_USER), controller.updateOne);

module.exports = router;
