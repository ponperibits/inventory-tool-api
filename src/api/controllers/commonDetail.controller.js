const Party = require("../models/party.model");
const Product = require("../models/product.model");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const noOfSuppliers = await Party.countDocuments({
      type: "Supplier",
      userId: req.user._id,
    });
    const noOfCustomers = await Party.countDocuments({
      type: "Customer",
      userId: req.user._id,
    });

    const noOfProducts = await Product.countDocuments({ userId: req.user._id });

    res.json({ noOfSuppliers, noOfCustomers, noOfProducts });
  } catch (error) {
    next(error);
  }
};
