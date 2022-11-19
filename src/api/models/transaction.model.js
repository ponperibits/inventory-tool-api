/** * *
Transaction
* */ const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");
const { currenciesSupported } = require("../utils/constants");

const transactionSchemaFields = {
  transactionDate: {
    type: Number,
    require: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: currenciesSupported,
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
});

const allFields = Object.keys(transactionSchemaFields).join(" ");

transactionSchema.method({});

transactionSchema.statics = {
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
    const transaction = await this.findOne({ _id }).exec();
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

module.exports = mongoose.model("Transaction", transactionSchema);
