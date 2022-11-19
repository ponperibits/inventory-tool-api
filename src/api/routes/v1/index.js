const express = require("express");
const authRoutes = require("./auth.route");

const partyRoutes = require("./party.route");
const productRoutes = require("./product.route");

const router = express.Router();

router.get("/status", (req, res) => res.send("Server Running..."));

router.use("/auth", authRoutes);
router.use("/party", partyRoutes);
router.use("/product", productRoutes);

module.exports = router;
