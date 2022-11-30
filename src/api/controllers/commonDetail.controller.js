const ObjectId = require("mongoose").Types.ObjectId;
const Party = require("../models/party.model");
const Product = require("../models/product.model");
const Transaction = require("../models/transaction.model");
const Expense = require("../models/expense.model");

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

    const noOfLowStockProducts = await Product.countDocuments({
      $and: [
        { $expr: { $lt: ["$noOfUnits", "$minStockWarning"] } },
        { userId: req.user._id },
      ],
    });

    const purchaseAggregate = await Transaction.aggregate([
      {
        $match: {
          supplierId: {
            $exists: true,
          },
          userId: new ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const saleAggregate = await Transaction.aggregate([
      {
        $match: {
          customerId: {
            $exists: true,
          },
          userId: new ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const otherIncomeAggregate = await Expense.aggregate([
      {
        $match: {
          type: "Income",
          userId: new ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const otherExpenseAggregate = await Expense.aggregate([
      {
        $match: {
          type: "Expense",
          userId: new ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    res.json({
      noOfSuppliers,
      noOfCustomers,
      noOfProducts,
      noOfLowStockProducts,
      totalPurchase: purchaseAggregate[0] ? purchaseAggregate[0].total : 0,
      totalSale: saleAggregate[0] ? saleAggregate[0].total : 0,
      totalOtherIncome: otherIncomeAggregate[0]
        ? otherIncomeAggregate[0].total
        : 0,
      totalOtherExpense: otherExpenseAggregate[0]
        ? otherExpenseAggregate[0].total
        : 0,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
