const express = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");

const partyRoutes = require("./party.route");
const productRoutes = require("./product.route");
const transactionRoutes = require("./transaction.route");
const recordRoutes = require("./record.route");
const expenseRoutes = require("./expense.route");

const commonDetailRoutes = require("./commonDetailRoutes");

const router = express.Router();

router.get("/status", (req, res) => res.send("Server Running..."));

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

router.use("/party", partyRoutes);
router.use("/product", productRoutes);
router.use("/transaction", transactionRoutes);
router.use("/record", recordRoutes);
router.use("/expense", expenseRoutes);

router.use("/commonDetail", commonDetailRoutes);

module.exports = router;
