const express = require("express");
const authRoutes = require("./auth.route");

const partyRoutes = require("./party.route");
const productRoutes = require("./product.route");
const transactionRoutes = require("./transaction.route");
const recordRoutes = require("./record.route");

const router = express.Router();

router.get("/status", (req, res) => res.send("Server Running..."));

router.use("/auth", authRoutes);
router.use("/party", partyRoutes);
router.use("/product", productRoutes);
router.use("/transaction", transactionRoutes);
router.use("/record", recordRoutes);

module.exports = router;
