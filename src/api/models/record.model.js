/** * *
Record
* */ const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");
const { currenciesSupported } = require("../utils/constants");

const recordSchemaFields = {
  transactionDate: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  noOfUnits: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: currenciesSupported,
  },
  prodUnitsBalance: {
    type: Number,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  UserId: {
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

const recordSchema = new mongoose.Schema(recordSchemaFields, {
  timestamps: { currentTime: () => Date.now() },
});

const allFields = Object.keys(recordSchemaFields).join(" ");

recordSchema.method({});

recordSchema.statics = {
  async list({ page = 1, perPage = 100, date, fields = allFields, ...rest }) {
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
    const record = await this.findOne({ _id }).exec();
    return record;
  },

  async updateRecord(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne(
      {
        _id: id,
      },
      updates
    ).exec();
  },
};

module.exports = mongoose.model("Record", recordSchema);
