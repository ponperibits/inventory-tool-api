/** * *
Transaction
* */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const transactionSchemaFields = {
  transactionDate: {
    type: Number,
    require: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
};

const transactionSchema = new mongoose.Schema(transactionSchemaFields, {
  timestamps: { currentTime: () => Date.now() },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const allFields = Object.keys(transactionSchemaFields).join(" ");

transactionSchema.method({});

transactionSchema.virtual("records", {
  ref: "Record",
  localField: "_id",
  foreignField: "transactionId",
});

transactionSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields, ...rest }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }
    return this.find(options, fields)
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    const transaction = await this.findOne({ _id })
      .populate("supplierId")
      .populate("customerId")
      .populate({
        path: "records",
        populate: {
          path: "productId",
        },
      })
      .exec();
    return transaction;
  },

  async updateTransaction(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne(
      {
        _id: id,
      },
      updates
    ).exec();
  },
};

transactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Transaction", transactionSchema);
