/** * *
Record
* */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const recordSchemaFields = {
  transactionDate: {
    type: Number,
    required: true,
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

const recordSchema = new mongoose.Schema(recordSchemaFields, {
  timestamps: { currentTime: () => Date.now() },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const allFields = Object.keys(recordSchemaFields).join(" ");

recordSchema.method({});

recordSchema.statics = {
  async list({
    page = 1,
    perPage = 100,
    date,
    fields = allFields,
    startDate,
    endDate,
    ...rest
  }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (startDate && startDate != "null" && endDate && endDate != "null") {
      options["transactionDate"] = { $gte: startDate, $lte: endDate };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .populate("supplierId", "name")
      .populate("customerId", "name")
      .populate("productId", "name")
      .sort({ transactionDate: 1 })
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

recordSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Record", recordSchema);
